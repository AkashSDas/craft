import { BadRequestException, Injectable } from "@nestjs/common";
import { ArticleRepository } from "./article.repository";
import { Types } from "mongoose";
import { UpdateArticleContentDto } from "./dto";
import {
    Article,
    BlockId,
    DEFAULT_BLOCKS_TEXT,
    DEFAULT_BLOCKS_TEXT_SEPARATOR,
    Heading,
    Image,
    Paragraph,
} from "./schema";
import { UploadApiResponse, v2 } from "cloudinary";
import { UploadedFile } from "express-fileupload";
import { calculateReadTime } from "src/utils/article";

@Injectable()
export class ArticleService {
    constructor(private repo: ArticleRepository) {}

    async createNewArticle(authorId: Types.ObjectId) {
        return await this.repo.initArticle(authorId);
    }

    async checkOwnership(authorId: Types.ObjectId, articleId: string) {
        return await this.repo.checkArticleExists(authorId, articleId);
    }

    async getArticle(articleId: string) {
        return await this.repo.getArticleById(articleId);
    }

    async getArticleForEdit(articleId: string) {
        return await this.repo.getArticleById(articleId, false);
    }

    async reorderBlocks(article: Article, blockIds: BlockId[]) {
        await this.repo.updateOne(article.articleId, {
            blockIds,
        });
        return article;
    }

    async getUserArticles(authorId: Types.ObjectId, type: "draft" | "public") {
        if (type === "public") {
            return await this.repo.getUserPublishedArticles(authorId);
        } else if (type === "draft") {
            return await this.repo.getUserDraftArticles(authorId);
        }

        throw new Error("Invalid article type");
    }

    async updateFiles(article: Article, files: Record<BlockId, UploadedFile>) {
        // Filter out files whose ids don't exist in article block ids

        const existingFiles: Record<BlockId, UploadedFile> = {};
        for (const blockId of Object.keys(files)) {
            if (article.blockIds.includes(blockId)) {
                existingFiles[blockId] = files[blockId];
            }
        }

        // Delete existing images

        const deleteIds: string[] = [];
        for (const blockId of Object.keys(existingFiles)) {
            const block = article.blocks.get(blockId);
            if (block) {
                if (block.type === "image" && block.value?.id) {
                    deleteIds.push(block.value.id);
                }
            } else {
                delete existingFiles[blockId];
            }
        }

        if (deleteIds.length > 0) {
            const deletePromises: ReturnType<any>[] = [];
            for (const id of deleteIds) {
                deletePromises.push(
                    v2.uploader.destroy(id, {}, (error, result) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(result);
                        }
                    }),
                );
            }
            await Promise.all(deletePromises);
        }

        // Upload new images

        const uploadPromises: ReturnType<any>[] = [];
        const savedFiles: Record<BlockId, UploadApiResponse> = {};
        for (const blockId of Object.keys(existingFiles)) {
            const file = existingFiles[blockId];
            uploadPromises.push(
                v2.uploader.upload(
                    file.tempFilePath,
                    {
                        folder: `${process.env.CLOUDINARY_DIR_ARTICLE_IMAGES}/${article._id}`,
                    },
                    (error, result) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(result);
                            savedFiles[blockId] = result;
                        }
                    },
                ),
            );
        }
        await Promise.all(uploadPromises);

        // Update ids and urls in article for those blocks

        for (const blockId of Object.keys(savedFiles)) {
            const result = savedFiles[blockId];
            const block = article.blocks.get(blockId);
            if (block && block.type === "image") {
                block.value.id = result.public_id;
                block.value.URL = result.secure_url;
                article.blocks.set(blockId, block as any);
            }
        }

        await this.repo.updateOne(article.articleId, {
            blocks: article.blocks,
        });
    }

    async updateArticleInfoUsingBlocks(articleId: string) {
        const article = await this.repo.getArticleById(articleId);
        const blocks = article.blocks;

        const heading = Array.from(blocks.values()).find(
            (block) => block.type === "heading" && block.value.variant === "h1",
        ) as Heading | undefined;

        const description = Array.from(blocks.values()).find(
            (block) => block.type === "paragraph",
        ) as Paragraph | undefined;

        const coverImg = Array.from(blocks.values()).find(
            (block) => block.type === "image",
        ) as Image | undefined;

        const update: Partial<Article> = {};
        if (heading) {
            update["headline"] = heading.value.text;
        }
        if (description) {
            update["description"] = description.value.text;
        }
        if (coverImg && coverImg.value.URL) {
            update["coverImage"] = { URL: coverImg.value.URL };
        }

        await this.repo.updateOne(articleId, update);
    }

    updateBlockTextForArticle(
        article: Article,
        dto: UpdateArticleContentDto,
        deletedBlockIds: string[],
    ) {
        const { blocksText } = article;
        const { addedBlockIds, blocks, changedBlockIds } = dto;

        // Prepare exsiting text data to be updated

        // > "##blockId1##content1##blockId2##content2".split("##")
        // [ '', 'blockId1', 'content1', 'blockId2', 'content2' ]
        const text = blocksText.split(DEFAULT_BLOCKS_TEXT_SEPARATOR);
        let textData = text.slice(1, text.length); // skipping 1st empty str
        if (text.length === 2) {
            // > "##".split("##")
            // [ '', '' ]
            textData = []; // empty text
        }

        const textRecord: Record<BlockId, string> = {};
        for (let i = 0; i < textData.length; i += 2) {
            const blockId = textData[i];
            if (blockId !== "") {
                const content = textData[i + 1];
                textRecord[blockId] = content;
            }
        }

        // Update existing blocks and add new blocks

        const upsertBlockIds = new Set([...changedBlockIds, ...addedBlockIds]);
        for (const blockId of Array.from(upsertBlockIds)) {
            const block = blocks[blockId];

            switch (block.type) {
                case "quote":
                    textRecord[blockId] = block.value.text;
                    break;
                case "paragraph":
                    textRecord[blockId] = block.value.text;
                    break;
                case "heading":
                    textRecord[blockId] = block.value.text;
                    break;
                case "image":
                    textRecord[blockId] = block.value.caption ?? "";
                    break;
                default:
                    break;
            }
        }

        // Delete blocks that are not in the new block ids

        for (const blockId of deletedBlockIds) {
            delete textRecord[blockId];
        }

        // calculate read time (in minutes)

        const readTimeInMs = calculateReadTime(
            Object.values(textRecord).join(" "),
        );

        // Get updated text

        let updatedText = "";
        for (const blockId of Object.keys(textRecord)) {
            updatedText += `##${blockId}##${textRecord[blockId]}`;
        }

        if (updatedText === "") {
            updatedText = DEFAULT_BLOCKS_TEXT;
        }

        return { readTimeInMs, updatedText };
    }

    async updateNonFileContent(article: Article, dto: UpdateArticleContentDto) {
        const { addedBlockIds, blockIds, blocks, changedBlockIds } = dto;

        // Update block ids
        const existingBlockIds = article.blockIds;
        article.blockIds = blockIds;

        // Update existing blocks and add new blocks
        const upsertBlockIds = new Set([...changedBlockIds, ...addedBlockIds]);
        for (const blockId of Array.from(upsertBlockIds)) {
            const block = blocks[blockId];

            // Maintain the existing image id if the image block is changed
            // as this will be used to delete the image from cloudinary
            if (block.type === "image" && changedBlockIds.includes(blockId)) {
                const existingBlock = article.blocks.get(blockId) as Image;
                (block.value as any).id = existingBlock?.value?.id;
            }

            article.blocks.set(blockId, block as any);
        }

        // Delete blocks that are not in the new block ids

        const deletedBlockIds = existingBlockIds.filter(
            (id) => !blockIds.includes(id),
        );

        const deleteImgIds: string[] = [];
        for (const id of deletedBlockIds) {
            const block = article.blocks.get(id);
            if (block && block.type === "image" && block.value?.id) {
                deleteImgIds.push(block.value.id);
            }
        }

        for (const id of deletedBlockIds) {
            article.blocks.delete(id);
        }

        // Delete all of the images

        const deletePromises: Promise<any>[] = [];
        for (const id of deleteImgIds) {
            deletePromises.push(
                v2.uploader.destroy(id, {}, (error, result) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(result);
                    }
                }),
            );
        }
        await Promise.all(deletePromises);

        // Get text data and calculate read time

        const { readTimeInMs, updatedText } = this.updateBlockTextForArticle(
            article,
            dto,
            deletedBlockIds,
        );

        // Update article in database

        await this.repo.updateOne(article.articleId, {
            blockIds: article.blockIds,
            blocks: article.blocks,
            blocksText: updatedText,
            readTimeInMs: readTimeInMs,
        });

        return article;
    }

    async exists(articleId: string) {
        return await this.repo.exists(articleId);
    }

    async getArticlesForReadListPreview(articleIds: string[]) {
        return await this.repo.getArticlesForReadListPreview(articleIds);
    }

    async publishArticle(article: Article) {
        // check if the article has headline, description, cover image
        // if not, throw error

        if (
            !article.headline ||
            !article.description ||
            !article.coverImage ||
            !article.coverImage.URL
        ) {
            throw new BadRequestException(
                "Headline, description, and cover image are required to publish an article",
            );
        }

        await this.repo.updateOne(article.articleId, {
            isPublic: true,
        });
        return article;
    }

    async getArticlesPaginated(limit: number, offset: number, query?: string) {
        return await this.repo.getArticlesPaginated(limit, offset, query);
    }

    async getTrendingArticles(limit: number) {
        return this.repo.getTrendingArticles(limit);
    }

    async deleteArticle(articleId: Types.ObjectId) {
        const article = await this.repo.findOne({ _id: articleId }, "blocks");

        if (article) {
            const { blocks } = article;
            const deleteBlockIds: string[] = [];

            for (const block of blocks.values()) {
                if (block.type === "image" && block.value.id) {
                    deleteBlockIds.push(block.value.id);
                }
            }

            const deletePromises: Promise<any>[] = [];

            for (const id of deleteBlockIds) {
                deletePromises.push(
                    v2.uploader.destroy(id, {}, (error, result) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(result);
                        }
                    }),
                );
            }

            await Promise.all(deletePromises);
            await this.repo.deleteOne({ _id: articleId });
        }
    }
}

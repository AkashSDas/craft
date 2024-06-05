import { Injectable } from "@nestjs/common";
import { ArticleRepository } from "./article.repository";
import { Types } from "mongoose";
import { UpdateArticleContentDto } from "./dto";
import { Article, BlockId, Image } from "./schema";
import { UploadApiResponse, v2 } from "cloudinary";
import { UploadedFile } from "express-fileupload";

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
            console.log({ block });
            if (block) {
                if (block.type === "image" && block.value?.id) {
                    deleteIds.push(block.value.id);
                }
            } else {
                delete existingFiles[blockId];
            }
        }
        console.log(deleteIds, existingFiles);

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

        // Update article in database

        await this.repo.updateOne(article.articleId, {
            blockIds: article.blockIds,
            blocks: article.blocks,
        });

        return article;
    }
}

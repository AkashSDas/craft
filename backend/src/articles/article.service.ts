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
        // 1. filter out files whose ids don't exist in article block ids
        const existingFiles: Record<BlockId, UploadedFile> = {};
        for (const blockId of Object.keys(files)) {
            if (article.blockIds.includes(blockId)) {
                existingFiles[blockId] = files[blockId];
            }
        }
        console.log("existingFiles", existingFiles);

        // 2. delete existing images

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
        console.log("deleteIds", deleteIds);

        if (deleteIds.length > 0) {
            const deletePromises: ReturnType<any>[] = [];
            for (const id of deleteIds) {
                deletePromises.push(
                    v2.uploader.destroy(
                        `${process.env.CLOUDINARY_DIR_ARTICLE_IMAGES}/${article._id}/${id}`,
                    ),
                );
            }

            await Promise.all(deletePromises);
        }

        // 3. upload new images

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
                            savedFiles[blockId] = result;
                        }
                    },
                ),
            );
        }

        const results = await Promise.all(uploadPromises);
        console.log("results", uploadPromises, results);

        // 4. update ids and urls in article for those blocks

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
        article.blockIds = blockIds;

        // Update existing blocks
        for (const blockId of changedBlockIds) {
            const block = blocks[blockId];

            if (block.type === "image") {
                const url = block.value.URL;
                // file will be saved in another request
                if (url?.startsWith("blob:")) {
                    block.value.URL = null;
                }
            }

            article.blocks.set(blockId, block as any);
        }

        // Add new blocks
        for (const blockId of addedBlockIds) {
            const block = blocks[blockId];
            console.log("addedBlock", article.blocks, block);
            block["blockId"] = blockId;

            if (block.type === "image") {
                const url = block.value.URL;
                // file will be saved in another request
                if (url?.startsWith("blob:")) {
                    block.value.URL = null;
                }
            }

            article.blocks.set(blockId, block as any);
        }

        // Remove blocks

        const existingBlockIds = Object.keys(article.blocks).filter((id) =>
            id.startsWith("blk_"),
        );
        const deletedBlockIds = existingBlockIds.filter(
            (id) => !blockIds.includes(id),
        );

        const imgBlocks: Image[] = [];
        for (const id of deletedBlockIds) {
            const block = article.blocks[id];
            if (block.type === "image") {
                imgBlocks.push(block);
            }
        }

        for (const id of deletedBlockIds) {
            article.blocks.delete(id);
        }

        this.deleteImages(article._id, imgBlocks);

        await article.save();
        return article;
    }

    async deleteImages(articleId: string, imageBlocks: Image[]) {
        const deleteIds: string[] = [];
        for (const img of imageBlocks) {
            if (img.value?.id) {
                deleteIds.push(img.value.id);
            }
        }

        if (deleteIds.length === 0) return;

        const deletePromises: ReturnType<any>[] = [];
        for (const id of deleteIds) {
            deletePromises.push(
                v2.uploader.destroy(
                    `${process.env.CLOUDINARY_DIR_ARTICLE_IMAGES}/${articleId}/${id}`,
                ),
            );
        }

        await Promise.all(deletePromises);
    }
}

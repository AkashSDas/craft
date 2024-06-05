import { Injectable } from "@nestjs/common";
import { ArticleRepository } from "./article.repository";
import { Types } from "mongoose";
import { UpdateArticleContentDto } from "./dto";
import { Article, Image } from "./schema";
import { v2 } from "cloudinary";

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

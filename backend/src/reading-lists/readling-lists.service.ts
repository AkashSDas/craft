import { Injectable, NotFoundException } from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { Types } from "mongoose";
import {
    AddOrRemoveArticleToReadingListsDto,
    CreateReadingListDto,
} from "./dto";
import { ArticleRepository } from "src/articles/article.repository";

@Injectable()
export class ReadingListsService {
    constructor(
        private repo: ReadingListsRepository,
        private articleRepo: ArticleRepository,
    ) {}

    async createReadLaterList(userId: Types.ObjectId) {
        const exists = await this.repo.checkIfReadLaterForUserExists(userId);
        if (!exists) {
            this.repo.create({ userId, name: "Read Later", isReadLater: true });
        }
    }

    async addOrRemoveFromReadingLists(
        userId: Types.ObjectId,
        dto: AddOrRemoveArticleToReadingListsDto,
    ) {
        const artExists = await this.articleRepo.exists(dto.articleId);
        if (!artExists) throw new NotFoundException("Article not found");

        // add it to the reading lists (if not already exists) whose ids are
        // provided in the dto

        await this.repo.addArticleToLists(
            userId,
            artExists._id,
            dto.readingListIds.map((id) => new Types.ObjectId(id)),
        );

        // remove the article from the reading lists in which it is not mentioned

        await this.repo.removeArticleFromListsNotMentioned(
            userId,
            artExists._id,
            dto.readingListIds.map((id) => new Types.ObjectId(id)),
        );
    }

    async createReadingList(userId: Types.ObjectId, dto: CreateReadingListDto) {
        return await this.repo.create({
            userId,
            name: dto.name,
            isPrivate: dto.isPrivate,
        });
    }

    async getReadingLists(userId: Types.ObjectId) {
        return await this.repo.getUserReadingLists(userId);
    }
}

import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { Types } from "mongoose";
import {
    AddOrRemoveArticleToReadingListsDto,
    CreateReadingListDto,
} from "./dto";
import { ArticleRepository } from "src/articles/article.repository";
import { UserRepository } from "src/users/user.repository";
import { LikesService } from "src/likes/likes.service";
import { Article } from "src/articles/schema";

@Injectable()
export class ReadingListsService {
    constructor(
        private repo: ReadingListsRepository,
        private articleRepo: ArticleRepository,
        private userRepo: UserRepository,
        private likesService: LikesService,
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
            dto.articleId,
            dto.readingListIds.map((id) => new Types.ObjectId(id)),
        );

        // remove the article from the reading lists in which it is not mentioned

        await this.repo.removeArticleFromListsNotMentioned(
            userId,
            dto.articleId,
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

    async getAuthorReadingLists(userId: Types.ObjectId) {
        return await this.repo.getAuthorReadingLists(userId);
    }

    async getReadingList(userId: string, readingListId: string) {
        const list = await this.repo.findOne(readingListId);
        if (!list) {
            throw new NotFoundException("Reading list not found");
        }

        if (list.isPrivate) {
            if (!userId) {
                throw new ForbiddenException(
                    "You are not authorized to view this list",
                );
            }

            const user = await this.userRepo.findOne({ userId });
            if (!user) {
                throw new ForbiddenException(
                    "You are not authorized to view this list",
                );
            }

            if (list.userId._id.toString() !== user._id.toString()) {
                throw new ForbiddenException(
                    "You are not authorized to view this list",
                );
            }
        }

        const articles = await this.articleRepo.getArticlesForReadListPreview(
            list.articleIds,
        );
        const likes = await this.likesService.getArticlesLikes(
            articles.map((art: Article) => art._id),
        );

        return { list, articles, likes };
    }

    async deleteReadingList(userId: Types.ObjectId, readingListId: string) {
        const exists = await this.repo.exists(readingListId, userId);
        if (!exists) {
            throw new NotFoundException("Reading list not found");
        }

        await this.repo.deleteOne(userId, exists._id);
    }

    async updateReadingList(
        userId: Types.ObjectId,
        readingListId: string,
        dto: CreateReadingListDto,
    ) {
        const exists = await this.repo.exists(readingListId, userId);
        if (!exists) {
            throw new NotFoundException("Reading list not found");
        }

        await this.repo.update(userId, exists._id, dto);
    }
}

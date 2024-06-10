import { Injectable, NotFoundException } from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { Types } from "mongoose";
import { AddArticleToReadingListsDto, CreateReadingListDto } from "./dto";
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

    async addToReadingLists(
        userId: Types.ObjectId,
        dto: AddArticleToReadingListsDto,
    ) {
        const artExists = await this.articleRepo.exists(dto.articleId);
        if (!artExists) throw new NotFoundException("Article not found");

        const readingLists = await this.repo.findReadingLists(
            dto.readingListIds,
        );

        readingLists.forEach((list) => {
            if (list.userId.toString() !== userId.toString()) {
                throw new NotFoundException("Reading list not found");
            }
        });

        const promises: Promise<any>[] = [];
        readingLists.forEach((list) => {
            promises.push(this.repo.pushArticleToList(list._id, artExists._id));
        });

        await Promise.all(promises);
    }

    async createReadingList(userId: Types.ObjectId, dto: CreateReadingListDto) {
        const articleIds: Types.ObjectId[] = [];

        // Get article ids and check if they exist
        if (dto.articleIds && dto.articleIds.length > 0) {
            const promises = dto.articleIds.map((id) => {
                return this.articleRepo.exists(id);
            });
            const articles = await Promise.all(promises);

            articles.forEach((article) => {
                if (article) {
                    articleIds.push(article._id);
                }
            });
        }

        // Create the reading list
        return await this.repo.create({
            userId,
            name: dto.name,
            isPrivate: dto.isPrivate,
            articleIds,
        });
    }

    async getReadingLists(userId: Types.ObjectId) {
        return await this.repo.getUserReadingLists(userId);
    }
}

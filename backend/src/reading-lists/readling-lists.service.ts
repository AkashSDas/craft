import { Injectable } from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { Types } from "mongoose";
import { CreateReadingListDto } from "./dto";
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
            articleIds,
        });
    }
}

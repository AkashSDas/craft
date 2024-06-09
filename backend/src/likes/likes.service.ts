import { BadRequestException, Injectable } from "@nestjs/common";
import { LikesRepository } from "./likes.repository";
import { ArticleRepository } from "src/articles/article.repository";
import { Types } from "mongoose";

@Injectable()
export class LikesService {
    constructor(
        private repo: LikesRepository,
        private articleRepo: ArticleRepository,
    ) {}

    async likeArticle(articleId: string, userId: Types.ObjectId) {
        const exists = await this.articleRepo.exists(articleId);
        if (!exists) {
            throw new BadRequestException("Arrticle doesn't exists");
        }

        const hasLiked = await this.repo.exists(exists._id, userId);

        if (hasLiked) {
            await this.repo.createLike(exists._id, userId);
        } else {
            await this.repo.deleteLike(exists._id, userId);
        }
    }

    async getLikedArticles(userId: Types.ObjectId) {
        const res = await this.repo.getLikedArticles(userId);
        const articleIds = res.map((r) => r.articleId);
        const articles = await this.articleRepo.getArticles(articleIds);
        return articles;
    }
}

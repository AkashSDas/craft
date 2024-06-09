import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Like } from "./schema";
import { Model, Types } from "mongoose";

@Injectable()
export class LikesRepository {
    constructor(@InjectModel(Like.name) private model: Model<Like>) {}

    async createLike(articleId: Types.ObjectId, userId: Types.ObjectId) {
        return await this.model.create({
            articleId,
            userId,
        });
    }

    async exists(articleId: Types.ObjectId, userId: Types.ObjectId) {
        return await this.model.exists({ articleId, userId });
    }

    async deleteLike(
        articleId: Types.ObjectId,
        userId: Types.ObjectId,
    ): Promise<any> {
        return await this.model.deleteOne({ articleId, userId });
    }

    async getLikes(articleId: Types.ObjectId) {
        return await this.model.find({ articleId });
    }

    async getLikesCount(articleId: Types.ObjectId) {
        return await this.model.find({ articleId }).countDocuments();
    }

    async getUserLikes(userId: Types.ObjectId) {
        return await this.model.findOne({ userId });
    }
}

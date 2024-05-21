import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "./schema";
import { Model, Types } from "mongoose";

@Injectable({})
export class ArticleRepository {
    constructor(@InjectModel(Article.name) private model: Model<Article>) {}

    /** Initialize an article by an author. */
    async initArticle(authorId: Types.ObjectId) {
        return await this.model.create({ authorIds: [authorId] });
    }
}
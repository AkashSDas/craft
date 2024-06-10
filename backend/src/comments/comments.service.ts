import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comments.repository";
import { Types } from "mongoose";

@Injectable()
export class CommentService {
    constructor(private repo: CommentRepository) {}

    async addComment(
        text: string,
        authorId: Types.ObjectId,
        articleId: Types.ObjectId,
    ) {
        return this.repo.createComment({ text, articleId, authorId });
    }
}

import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
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

    async getComments(articleId: Types.ObjectId) {
        return this.repo.getCommentsByArticleId(articleId);
    }

    async reportComment(commentId: string, userId: Types.ObjectId) {
        const comment = await this.repo.getCommentById(commentId);
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        if (comment.reports.includes(userId)) {
            throw new BadRequestException("Comment already reported");
        }

        comment.reports.push(userId);
        return comment.save();
    }

    async deleteComment(commentId: string) {
        const comment = await this.repo.getCommentById(commentId);
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }

        await this.repo.deleteChildComments(comment._id);
        return this.repo.deleteComment(comment._id);
    }
}

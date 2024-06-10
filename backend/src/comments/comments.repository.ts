import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Comment } from "./schema";

@Injectable()
export class CommentRepository {
    constructor(@InjectModel(Comment.name) private model: Model<Comment>) {}

    async createComment(comment: Partial<Comment>) {
        return (await this.model.create(comment)).populate(
            "authorId",
            "username userId profilePic",
        );
    }

    async deleteComment(commentId: Types.ObjectId) {
        return this.model.findByIdAndDelete(commentId);
    }

    async deleteChildComments(parentCommentId: Types.ObjectId): Promise<any> {
        return this.model.deleteMany({ parentCommentId });
    }

    async getCommentsByArticleId(articleId: Types.ObjectId) {
        return this.model.find({ articleId });
    }

    async getChildComments(parentCommentId: Types.ObjectId) {
        return this.model.find({ parentCommentId });
    }

    async updateCommentText(commentId: Types.ObjectId, text: string) {
        return this.model.findByIdAndUpdate(commentId, { text });
    }
}

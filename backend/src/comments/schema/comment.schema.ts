import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, Document } from "mongoose";
import { Article } from "src/articles/schema";
import { User } from "src/users/schema";

export interface IComment {
    text: string;
    /** user ids */
    reports: Types.ObjectId[];
    authorId: Types.ObjectId;
    articleId: Types.ObjectId;
    parentCommentId?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Comment extends Document implements IComment {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    authorId: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Article.name })
    articleId: Types.ObjectId;

    @Prop({ type: String, trim: true, required: true })
    text: string;

    @Prop({
        type: [SchemaTypes.ObjectId],
        default: [],
        required: true,
        ref: User.name,
    })
    reports: Types.ObjectId[];

    @Prop({ type: SchemaTypes.ObjectId, ref: Comment.name })
    parentCommentId: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { User } from "src/users/schema";

export interface IComment {
    text: string;
    reportCount: number;
    authorId: Types.ObjectId;
    parentCommentId?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Comment extends Document implements IComment {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    authorId: Types.ObjectId;

    @Prop({ type: String, trim: true, required: true })
    text: string;

    @Prop({ type: Number, trim: true, required: true, default: 0 })
    reportCount: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: Comment.name })
    parentCommentId: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

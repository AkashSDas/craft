import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { Article } from "src/articles/schema";
import { User } from "src/users/schema";

export interface ILike {
    articleId: Types.ObjectId;
    userId: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Like extends Document implements ILike {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Article.name })
    articleId: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

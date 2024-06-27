import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { Article } from "src/articles/schema";
import { User } from "src/users/schema";

export interface IView {
    articleId: Types.ObjectId;
    userId: Types.ObjectId;
    readTimeInMs: number;
    hasRead: boolean;
}

@Schema({ timestamps: true })
export class View extends Document implements IView {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: Article.name })
    articleId: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({ type: Number, required: true, default: 0 })
    readTimeInMs: number;

    @Prop({ type: Boolean, required: true, default: false })
    hasRead: boolean;
}

export const ViewSchema = SchemaFactory.createForClass(View);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types, Document } from "mongoose";
import { IImage, ImageSchema, User } from "../../users/schema";
import {
    ContentBlockSchema,
    type BlockId,
    type ContentBlockType,
} from "./content-block.schema";
import { createId } from "../../utils/ids";

export interface IArticle {
    // Core info
    articleId: string;
    authorIds: Types.ObjectId[];

    // Description
    headline?: string;
    description?: string;
    coverImage?: IImage;
    topics: string[];
    readTimeInMs: number;
    lastUpdatedAt: Date;

    // Content
    blockIds: BlockId[];
    blocks: Record<BlockId, ContentBlockType>;
}

@Schema({ timestamps: true })
export class Article extends Document implements IArticle {
    @Prop({
        type: String,
        required: true,
        unique: true,
        default: () => createId("art"),
        immutable: true,
    })
    articleId: string;

    @Prop({
        type: [SchemaTypes.ObjectId],
        required: true,
        minlength: 1,
        ref: User.name,
    })
    authorIds: Types.ObjectId[];

    @Prop({ type: String, trim: true })
    headline?: string;

    @Prop({ type: String, trim: true })
    description?: string;

    @Prop({ type: ImageSchema })
    coverImage?: IImage;

    @Prop({ type: [String], required: true, default: [] })
    topics: string[];

    @Prop({ type: Number, required: true, min: 0, default: 0 })
    readTimeInMs: number;

    @Prop({ type: Date, required: true })
    lastUpdatedAt: Date;

    @Prop({ type: [String], required: true, default: [], select: false })
    blockIds: BlockId[];

    @Prop({
        type: Map,
        of: ContentBlockSchema,
        required: true,
        default: {},
        _id: false,
    })
    blocks: Record<BlockId, ContentBlockType>;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

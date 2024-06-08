import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Document } from "mongoose";
import { IImage } from "../../users/schema";

// ====================================
// Content block types
// ====================================

export type Paragraph = {
    type: "paragraph";
    value: { text: string };
};

export type Heading = {
    type: "heading";
    value: { text: string; variant: "h1" | "h2" | "h3" };
};

export type Divider = {
    type: "divider";
    value: Record<string, never>;
};

export type Image = {
    type: "image";
    value: IImage & { caption?: string };
};

export type Quote = {
    type: "quote";
    value: { text: string };
};

export type Block = Paragraph | Heading | Divider | Image | Quote;
export type BlockId = string;
export type ContentBlockType = Block & { blockId: BlockId };

interface IContentBlock {
    blockId: BlockId;
    type: Block["type"];
    value: Block["value"];
}

// ====================================
// Content block model
// ====================================

export const blocks: Block["type"][] = [
    "paragraph",
    "heading",
    "divider",
    "image",
    "quote",
] as const;

@Schema({ _id: false, timestamps: true })
export class ContentBlock extends Document implements IContentBlock {
    @Prop({ type: String, required: true })
    blockId: BlockId;

    @Prop({ type: String, required: true, enum: blocks })
    type: Block["type"];

    @Prop({ type: SchemaTypes.Mixed })
    value: Block["value"];
}

export const ContentBlockSchema = SchemaFactory.createForClass(ContentBlock);

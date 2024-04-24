import { isURL } from "class-validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/**
 * User can add image urls or save image (in this case id will be created by
 * storage provider like S3/cloudinary)
 */
export interface IImage {
    id?: string;
    URL: string;
}

@Schema({ _id: false })
export class Image implements IImage {
    @Prop({ type: String })
    id?: string;

    @Prop({ type: String, required: true, validate: [isURL, "Invalid url"] })
    URL: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

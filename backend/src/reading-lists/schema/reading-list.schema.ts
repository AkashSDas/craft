import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { Article } from "src/articles/schema";
import { User } from "src/users/schema";

export interface IReadingList {
    userId: Types.ObjectId;
    name: string;
    articleIds: string[];

    /**
     * A user can have only one ReadingList with read later and it will be
     * created when account is created
     **/
    isReadLater: boolean;

    isPrivate: boolean;
}

@Schema({ timestamps: true })
export class ReadingList extends Document implements IReadingList {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({
        type: [String],
        default: [],
        required: true,
        ref: Article.name,
    })
    articleIds: string[];

    @Prop({ type: Boolean, required: true, default: false })
    isReadLater: boolean;

    @Prop({ type: Boolean, required: true, default: false })
    isPrivate: boolean;
}

export const ReadingListSchema = SchemaFactory.createForClass(ReadingList);

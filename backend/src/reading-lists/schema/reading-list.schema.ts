import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { Article } from "src/articles/schema";
import { User } from "src/users/schema";

export interface IReadingList {
    userId: Types.ObjectId;
    name: string;
    articleIds: Types.ObjectId[];

    /**
     * A user can have only one ReadingList with read later and it will be
     * created when account is created
     **/
    isReadLater: boolean;
}

@Schema({ timestamps: true })
export class ReadingList extends Document implements IReadingList {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    userId: Types.ObjectId;

    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({
        type: [SchemaTypes.ObjectId],
        default: [],
        required: true,
        ref: Article.name,
    })
    articleIds: Types.ObjectId[];

    @Prop({ type: Boolean, required: true, default: false })
    isReadLater: boolean;
}

export const ReadingListSchema = SchemaFactory.createForClass(ReadingList);

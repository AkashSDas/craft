import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { User } from "src/users/schema";

export interface IFollower {
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Follower extends Document implements IFollower {
    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    followerId: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
    followingId: Types.ObjectId;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);

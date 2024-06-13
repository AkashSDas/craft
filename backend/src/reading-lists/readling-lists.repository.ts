import { Injectable } from "@nestjs/common";
import { ReadingList } from "./schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

@Injectable()
export class ReadingListsRepository {
    constructor(
        @InjectModel(ReadingList.name) private model: Model<ReadingList>,
    ) {}

    async create(data: Partial<ReadingList>) {
        return this.model.create(data);
    }

    async update(
        userId: Types.ObjectId,
        listId: Types.ObjectId,
        data: Partial<ReadingList>,
    ) {
        return this.model.updateOne({ _id: listId, userId }, data);
    }

    async delete(listId: Types.ObjectId): Promise<any> {
        return this.model.deleteOne({ _id: listId });
    }

    async getUserReadingLists(userId: Types.ObjectId) {
        return this.model
            .find({ userId })
            .populate("userId", "userId username profilePic");
    }

    async checkIfReadLaterForUserExists(userId: Types.ObjectId) {
        return this.model.findOne({ userId, isReadLater: true });
    }

    async addArticleToLists(
        userId: Types.ObjectId,
        articleId: string,
        readingListIds: Types.ObjectId[],
    ) {
        return this.model.updateMany(
            { _id: { $in: readingListIds }, userId },
            { $addToSet: { articleIds: articleId } },
        );
    }

    async removeArticleFromListsNotMentioned(
        userId: Types.ObjectId,
        articleId: string,
        readingListIds: Types.ObjectId[],
    ) {
        if (readingListIds.length === 0) {
            return this.model.updateMany(
                { userId },
                { $pull: { articleIds: articleId } },
            );
        } else {
            return this.model.updateMany(
                { _id: { $nin: readingListIds }, userId },
                { $pull: { articleIds: articleId } },
            );
        }
    }

    async findOne(listId: string) {
        return this.model
            .findOne({ _id: listId })
            .populate("userId", "username userId profilePic");
    }

    async deleteOne(
        userId: Types.ObjectId,
        listId: Types.ObjectId,
    ): Promise<any> {
        return this.model.deleteOne({ _id: listId, userId });
    }

    async exists(listId: string, userId: Types.ObjectId) {
        return this.model.exists({ _id: listId, userId });
    }
}

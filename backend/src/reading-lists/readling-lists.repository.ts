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

    async pushArticleToList(listId: Types.ObjectId, articleId: Types.ObjectId) {
        return this.model.updateOne(
            { _id: listId },
            { $push: { articleIds: articleId } },
        );
    }

    async removeArticleFromList(
        listId: Types.ObjectId,
        articleId: Types.ObjectId,
    ) {
        return this.model.updateOne(
            { _id: listId },
            { $pull: { articleIds: articleId } },
        );
    }

    async update(listId: Types.ObjectId, data: Partial<ReadingList>) {
        return this.model.updateOne({ _id: listId }, data);
    }

    async delete(listId: Types.ObjectId): Promise<any> {
        return this.model.deleteOne({ _id: listId });
    }

    async getUserReadingLists(userId: Types.ObjectId) {
        return this.model.find({ userId }).populate("articleIds");
    }

    async checkIfReadLaterForUserExists(userId: Types.ObjectId) {
        return this.model.findOne({ userId, isReadLater: true });
    }
}

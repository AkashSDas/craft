import { Injectable } from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { Types } from "mongoose";

@Injectable()
export class ReadingListsService {
    constructor(private repo: ReadingListsRepository) {}

    async createReadLaterList(userId: Types.ObjectId) {
        const exists = await this.repo.checkIfReadLaterForUserExists(userId);
        if (!exists) {
            this.repo.create({ userId, name: "Read Later", isReadLater: true });
        }
    }
}

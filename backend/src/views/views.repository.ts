import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { View } from "./schema";
import { FilterQuery, Model, UpdateQuery } from "mongoose";

@Injectable()
export class ViewsRepsitory {
    constructor(@InjectModel(View.name) private model: Model<View>) {}

    async create(view: Partial<View>) {
        return await this.model.create(view);
    }

    async findOne(filter: FilterQuery<View>) {
        return await this.model.findOne(filter);
    }

    async updateOne(filter: FilterQuery<View>, update: UpdateQuery<View>) {
        return await this.model.updateOne(filter, update);
    }

    async exsits(filter: FilterQuery<View>) {
        return await this.model.exists(filter);
    }
}

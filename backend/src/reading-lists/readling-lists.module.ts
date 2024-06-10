import { Module } from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { ReadingListsService } from "./readling-lists.service";
import { ReadingListsController } from "./readling-lists.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ReadingList, ReadingListSchema } from "./schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ReadingList.name, schema: ReadingListSchema },
        ]),
    ],
    controllers: [ReadingListsController],
    providers: [ReadingListsRepository, ReadingListsService],
    exports: [ReadingListsService],
})
export class ReadingListsModule {}

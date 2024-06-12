import { Module } from "@nestjs/common";
import { ReadingListsRepository } from "./readling-lists.repository";
import { ReadingListsService } from "./readling-lists.service";
import { ReadingListsController } from "./readling-lists.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ReadingList, ReadingListSchema } from "./schema";
import { ArticleModule } from "src/articles/article.module";
import { UserModule } from "src/users/user.module";
import { LikesModule } from "src/likes/likes.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ReadingList.name, schema: ReadingListSchema },
        ]),
        ArticleModule,
        UserModule,
        LikesModule,
    ],
    controllers: [ReadingListsController],
    providers: [ReadingListsRepository, ReadingListsService],
    exports: [ReadingListsService],
})
export class ReadingListsModule {}

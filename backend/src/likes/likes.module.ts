import { Module, forwardRef } from "@nestjs/common";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";
import { LikesRepository } from "./likes.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Like, LikeSchema } from "./schema";
import { ArticleModule } from "src/articles/article.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        forwardRef(() => ArticleModule),
    ],
    controllers: [LikesController],
    providers: [LikesService, LikesRepository],
    exports: [LikesService],
})
export class LikesModule {}

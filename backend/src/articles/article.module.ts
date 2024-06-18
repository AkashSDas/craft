import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Article, ArticleSchema } from "./schema";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { ArticleRepository } from "./article.repository";
import { LikesModule } from "src/likes/likes.module";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
        ]),
        LikesModule,
        forwardRef(() => UserModule),
    ],
    controllers: [ArticleController],
    providers: [ArticleService, ArticleRepository],
    exports: [ArticleRepository, ArticleService],
})
export class ArticleModule {}

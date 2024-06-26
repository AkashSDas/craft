import { Module } from "@nestjs/common";
import { CommentController } from "./comments.controller";
import { CommentService } from "./comments.service";
import { CommentRepository } from "./comments.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schema";
import { ArticleModule } from "src/articles/article.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
        ]),
        ArticleModule,
    ],
    controllers: [CommentController],
    providers: [CommentRepository, CommentService],
})
export class CommentModule {}

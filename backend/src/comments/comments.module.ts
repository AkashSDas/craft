import { Module } from "@nestjs/common";
import { CommentController } from "./comments.controller";
import { CommentService } from "./comments.service";
import { CommentRepository } from "./comments.repository";

@Module({
    imports: [],
    controllers: [CommentController],
    providers: [CommentRepository, CommentService],
})
export class CommentModule {}

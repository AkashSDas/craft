import { Module } from "@nestjs/common";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";
import { LikesRepository } from "./likes.repository";

@Module({
    controllers: [LikesController],
    providers: [LikesService, LikesRepository],
})
export class LikesModule {}

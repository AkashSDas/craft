import { Module } from "@nestjs/common";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";
import { LikesRepository } from "./likes.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/users/user.module";
import { Like, LikeSchema } from "./schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
        UserModule,
    ],
    controllers: [LikesController],
    providers: [LikesService, LikesRepository],
})
export class LikesModule {}

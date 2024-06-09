import { Module } from "@nestjs/common";
import { FollowersController } from "./followers.controller";
import { FollowersService } from "./followers.service";
import { FollowersRepository } from "./followers.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Follower, FollowerSchema } from "./schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Follower.name, schema: FollowerSchema },
        ]),
    ],
    controllers: [FollowersController],
    providers: [FollowersService, FollowersRepository],
})
export class FollowersModule {}

import { Module } from "@nestjs/common";
import { FollowersController } from "./followers.controller";
import { FollowersService } from "./followers.service";
import { FollowersRepository } from "./followers.repository";

@Module({
    controllers: [FollowersController],
    providers: [FollowersService, FollowersRepository],
})
export class FollowersModule {}

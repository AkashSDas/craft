import { Module } from "@nestjs/common";
import { FollowersController } from "./followers.controller";
import { FollowersService } from "./followers.service";
import { FollowersRepository } from "./followers.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Follower, FollowerSchema } from "./schema";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Follower.name, schema: FollowerSchema },
        ]),
        UserModule,
    ],
    controllers: [FollowersController],
    providers: [FollowersService, FollowersRepository],
})
export class FollowersModule {}

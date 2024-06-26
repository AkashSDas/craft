import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";
import { ArticleModule } from "./articles/article.module";
import { CloudinaryProvider } from "./utils/cloudinary";
import { FollowersModule } from "./followers/followers.module";
import { LikesModule } from "./likes/likes.module";
import { CommentModule } from "./comments/comments.module";
import { ReadingListsModule } from "./reading-lists/readling-lists.module";
import { ViewsModule } from "./views/views.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        AuthModule,
        UserModule,
        ArticleModule,
        FollowersModule,
        LikesModule,
        CommentModule,
        ReadingListsModule,
        ViewsModule,
    ],
    providers: [CloudinaryProvider],
})
export class AppModule {}

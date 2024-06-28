import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { FollowersService } from "src/followers/followers.service";
import { Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import { v2 } from "cloudinary";
import { UpdateProfileDto } from "./dto";
import { User } from "./schema";

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => FollowersService))
        private followersService: FollowersService,
        private repo: UserRepository,
    ) {}

    async getAuthorProfile(authorId: string) {
        const author = await this.repo.findOne({ userId: authorId });
        let followersCount = 0;

        if (author) {
            followersCount = await this.followersService.getFollowersCount(
                author._id,
            );
        }

        return { author, followersCount };
    }

    async getRisingAuthors(limit: number) {
        const authors = await this.repo.findRisingAuthors(limit);
        return authors;
    }

    async checkUserExists(userId: string) {
        return await this.repo.exists({ userId });
    }

    async updateUserProfilePic(userId: Types.ObjectId, file: UploadedFile) {
        const user = await this.repo.findOne({ _id: userId }, "profilePic");
        if (!user) throw new NotFoundException("User not found");

        if (user.profilePic.id) {
            await v2.uploader.destroy(user.profilePic.id, {}, (err, result) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(result);
                }
            });
        }

        const profilePic = await v2.uploader.upload(file.tempFilePath, {
            folder: `${process.env.CLOUDINARY_DIR_USER_IMAGES}/${userId}`,
        });

        return { id: profilePic.public_id, URL: profilePic.secure_url };
    }

    async updateUserProfile(
        userId: Types.ObjectId,
        payload: UpdateProfileDto,
        file: UploadedFile | undefined | null,
    ) {
        const user = await this.repo.findOne({ _id: userId }, "oAuthProviders");
        if (user.oAuthProviders.length > 0 && payload.email) {
            delete payload["email"];
        }

        const update: Partial<Pick<User, "profilePic" | "email" | "username">> =
            { ...payload };

        if (file) {
            update["profilePic"] = await this.updateUserProfilePic(
                userId,
                file,
            );
        }
        await this.repo.updateOne({ _id: userId }, { $set: update });
    }
}

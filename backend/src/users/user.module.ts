import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { type AsyncModelFactory, MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

const userFeatureAsync: AsyncModelFactory = {
    name: User.name,

    /**
     * This function returns the user schema with pre and post hooks for saving data to MongoDB.
     * The post hook handles duplicate errors and returns an error if the fields are duplicated.
     */
    useFactory(): typeof UserSchema {
        UserSchema.post(
            "save",
            function (error: any, _doc: any, next: (error?: Error) => void) {
                if (error.name == "MongoServerError" && error.code == 11000) {
                    next(new Error("User already exists"));
                } else {
                    next(error);
                }

                next();
            },
        );

        return UserSchema;
    },
};

@Module({
    imports: [MongooseModule.forFeatureAsync([userFeatureAsync])],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserRepository],
})
export class UserModule {}

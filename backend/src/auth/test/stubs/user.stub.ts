import { User } from "src/users/schema";
import { Types } from "mongoose";

export const userStub = (): Partial<
    User & {
        createdAt: string;
        updatedAt: string;
    }
> => {
    return {
        username: "Akash",
        email: "akash@gmail.com",
        profilePic: {
            URL: "https://i.imgur.com/6VBx3io.png",
        },
        _id: new Types.ObjectId("662bcf2f28e197b10755c2ea"),
        userId: "acc_1z17it2723",
        oAuthProviders: [],
        createdAt: "2024-04-26T15:58:39.146Z",
        updatedAt: "2024-04-26T15:58:39.146Z",
        __v: 0,
    };
};

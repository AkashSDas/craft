import { User } from "@app/types/user";

export function userStub() {
    return {
        _id: "_id",
        createdAt: "createdAt",
        email: "email",
        userId: "userId",
        username: "username",
        profilePic: { id: "id", URL: "URL" },
    } satisfies User;
}

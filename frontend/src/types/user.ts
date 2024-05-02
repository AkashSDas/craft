export type User = {
    _id: string;
    userId: string;
    username: string;
    email: string;
    profilePic?: { id?: string; URL: string };
};

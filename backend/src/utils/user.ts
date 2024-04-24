import { type User } from "src/users/schema/user.schema";

// If the user doesn't exists or the user exists but the signup process isn't
// completed yet. To check if the user has completed the signup process, we

// check essential fields (username)
export function checkUserSignupIsComplete(user: User): boolean {
    return user.email && user.username ? true : false;
}

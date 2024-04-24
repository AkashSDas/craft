import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { UserRepository } from "src/users/user.repository";
import { GOOGLE_LOGIN_STRATEGY } from "src/utils/constants";
import { checkUserSignupIsComplete } from "src/utils/user";

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(
    Strategy,
    GOOGLE_LOGIN_STRATEGY,
) {
    constructor(private userRepo: UserRepository) {
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_LOGIN_CALLBACK_URL,
            scope: ["email", "profile"],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ) {
        const { email } = profile._json;
        const user = await this.userRepo.findOne({ email });

        if (!user || !checkUserSignupIsComplete(user)) {
            return done(null, null);
        }

        // Log the user in
        return done(null, user);
    }
}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthProvider } from "src/users/schema/oauth-provider.schema";
import { UserRepository } from "src/users/user.repository";
import { GOOGLE_SIGNUP_STRATEGY } from "src/utils/constants";

@Injectable()
export class GoogleSignupStrategy extends PassportStrategy(
    Strategy,
    GOOGLE_SIGNUP_STRATEGY,
) {
    constructor(private userRepo: UserRepository) {
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_SIGNUP_CALLBACK_URL,
            passReqToCallback: true,
            scope: ["email", "profile"],
        });
    }

    async validate(
        _req: Request,
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ) {
        const { email, sub, picture } = profile._json;
        const user = await this.userRepo.findOne({ email });

        // Login user if account already exists
        if (user) return done(null, user);

        // Signup user
        try {
            const newUser = await this.userRepo.create({
                email,
                profilePic: {
                    URL: picture ?? "https://i.imgur.com/6VBx3io.png",
                },
                oAuthProviders: [{ sid: sub, provider: AuthProvider.GOOGLE }],
            });

            return done(null, newUser);
        } catch (err) {
            return done(err, null);
        }
    }
}

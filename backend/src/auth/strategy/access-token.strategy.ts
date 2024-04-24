import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/schema/user.schema";
import { UserRepository } from "src/users/user.repository";
import { ACCESS_TOKEN_STRATEGY } from "src/utils/constants";

export type AccessTokenPayload = { email: string };

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    ACCESS_TOKEN_STRATEGY,
) {
    constructor(private userRepo: UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            passReqToCallback: true,
        });
    }

    /**
     * The returned value from here will be appened to req.user for routes
     * that are guarded by AuthGuard(ACCESS_TOKEN_STRATEGY)
     */
    async validate(_req: Request, payload: AccessTokenPayload): Promise<User> {
        return await this.userRepo.findOne({ email: payload.email });
    }
}

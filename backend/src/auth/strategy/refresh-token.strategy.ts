import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { REFRESH_TOKEN_STRATEGY } from "src/utils/constants";

function cookieExtractor(req: Request): string | undefined {
    return req.cookies?.refreshToken;
}

export type RefreshTokenPayload = { _id: string; email: string };

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    REFRESH_TOKEN_STRATEGY,
) {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
    }

    /**
     * The returned value from here will be attached to req.user for routes
     * that are guarded by AuthGuard(REFRESH_TOKEN_STRATEGY)
     */
    async validate(req: Request, payload: RefreshTokenPayload) {
        const refreshToken = req.cookies?.refreshToken;
        return { ...payload, refreshToken };
    }
}

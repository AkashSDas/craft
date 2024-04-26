import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { type JwtService } from "@nestjs/jwt";
import { type UserRepository } from "src/users/user.repository";
import {
    InitMagicLinkLoginDto,
    type EmailSignupDto,
    CreateOAuthSessionDto,
    CompleteOAuthSignupDto,
} from "./dto";
import { sendEmail } from "src/utils/mail";
import { createHash } from "crypto";
import { User } from "src/users/schema";
import { checkUserSignupIsComplete } from "src/utils/user";
import { type Types } from "mongoose";

@Injectable({})
export class AuthService {
    constructor(
        private userRepo: UserRepository,
        private jwtService: JwtService,
    ) {}

    async emailSignup(payload: EmailSignupDto) {
        try {
            const user = await this.userRepo.create({
                ...payload,
                profilePic: { URL: "https://i.imgur.com/6VBx3io.png" },
            });

            const accessToken = user.createAccessToken(this.jwtService);
            const refreshToken = user.createRefreshToken(this.jwtService);
            return { user, accessToken, refreshToken };
        } catch (e) {
            if (e.message == "User already exists") {
                throw new BadRequestException(
                    "Email or username already taken",
                );
            }

            throw new InternalServerErrorException();
        }
    }

    async initMagicLinkLogin(payload: InitMagicLinkLoginDto) {
        const user = await this.userRepo.findOne({ email: payload.email });
        if (!user) {
            throw new BadRequestException("User not found");
        }

        const token = user.createMagicLinkToken();
        const link = `${process.env.FRONTEND_URL}/auth/login?magic-token=${token}`;

        const mailStatus = await sendEmail({
            to: user.email,
            subject: "Magic link login",
            text: `Click on the link to login: ${link}`,
            html: `Click on the link to login: <a href="${link}">${link}</a>`,
        });

        console.log(`Mail status: ${mailStatus}`);
        await user.save({ validateModifiedOnly: true });
    }

    async completeMagicLinkLogin(token: string) {
        const unhased = createHash("sha256").update(token).digest("hex");
        const user = await this.userRepo.findOne({
            magicLinkToken: unhased,
            magicLinkTokenExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            throw new BadRequestException("Invalid token");
        }

        user.magicLinkToken = undefined;
        user.magicLinkTokenExpiresAt = undefined;
        await user.save({ validateModifiedOnly: true });

        const accessToken = user.createAccessToken(this.jwtService);
        const refreshToken = user.createRefreshToken(this.jwtService);
        return { user, accessToken, refreshToken };
    }

    async getNewAccessToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESH_TOKEN_SECRET,
            });
            if (!decoded?._id) throw new UnauthorizedException();

            const user = await this.userRepo.findOne({ _id: decoded._id });
            if (!user) throw new UnauthorizedException();

            const accessToken = user.createAccessToken(this.jwtService);
            return { user, accessToken };
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    oauthSignup(user?: User): string | undefined {
        if (user) {
            return user.createRefreshToken(this.jwtService);
        }
    }

    oauthLogin(user?: User): string | undefined {
        // Conditional to consider user as signed up
        if (checkUserSignupIsComplete(user)) {
            return user.createAccessToken(this.jwtService);
        }
    }

    async createOAuthSession(dto: CreateOAuthSessionDto) {
        const user = await this.userRepo.findOne({
            oauthSignupSessionToken: decodeURIComponent(dto.token),
        });

        if (!user) {
            throw new BadRequestException("Invalid token");
        }

        const accessToken = user.createAccessToken(this.jwtService);
        const refreshToken = user.createRefreshToken(this.jwtService);

        await this.userRepo.updateOne(
            { _id: user._id },
            { $unset: { oauthSignupSessionToken: undefined } },
        );

        return { user, accessToken, refreshToken };
    }

    async cancelOAuthSession(userId: Types.ObjectId) {
        await this.userRepo.deleteOne({ _id: userId });
    }

    async completeOAuthSignup(payload: CompleteOAuthSignupDto, user: User) {
        const updatedUser = await this.userRepo.findOneAndUpdate(
            { _id: user._id },
            {
                $set: { username: payload.username },
                $unset: { oauthSignupSessionToken: undefined },
            },
        );

        if (!updatedUser) {
            throw new BadRequestException("User not found");
        }

        const accessToken = updatedUser.createAccessToken(this.jwtService);
        const refreshToken = updatedUser.createRefreshToken(this.jwtService);

        return { user: updatedUser, accessToken, refreshToken };
    }
}

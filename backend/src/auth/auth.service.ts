import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { type JwtService } from "@nestjs/jwt";
import { type UserRepository } from "src/users/user.repository";
import { InitMagicLinkLoginDto, type EmailSignupDto } from "./dto";
import { sendEmail } from "src/utils/mail";
import { createHash } from "crypto";

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
}

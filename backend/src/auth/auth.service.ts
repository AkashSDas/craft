import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { type JwtService } from "@nestjs/jwt";
import { type UserRepository } from "src/users/user.repository";
import { type EmailSignupDto } from "./dto";

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
}

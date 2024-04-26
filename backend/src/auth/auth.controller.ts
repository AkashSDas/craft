import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { type AuthService } from "./auth.service";
import { type ConfigService } from "@nestjs/config";
import { InitMagicLinkLoginDto, type EmailSignupDto } from "./dto";
import { type Response, type Request } from "express";
import { CompleteMagicLinkLoginParam } from "./param";
import { RefreshTokenGuard } from "./guard";
import { AuthGuard } from "@nestjs/passport";
import { GOOGLE_SIGNUP_STRATEGY } from "src/utils/constants";
import { User } from "src/users/schema";
import { hash } from "argon2";

@Controller("auth")
export class AuthController {
    constructor(
        private service: AuthService,
        private configService: ConfigService,
    ) {}

    @Post("email-signup")
    @HttpCode(HttpStatus.CREATED)
    async emailSignup(
        @Body() dto: EmailSignupDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.service.emailSignup(dto);

        // This key should be same as the one used in RefreshTokenStrategy
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(
                this.configService.get("REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS"),
            ),
        });

        return { user: result.user, accessToken: result.accessToken };
    }

    @Post("email-login")
    @HttpCode(HttpStatus.OK)
    async initMagicLinkLogin(@Body() dto: InitMagicLinkLoginDto) {
        await this.service.initMagicLinkLogin(dto);
        return { message: "Login link sent to your email" };
    }

    @Post("email-login/:token")
    @HttpCode(HttpStatus.OK)
    async completeMagicLinkLogin(
        // @Param("token") token: string,
        @Param() params: CompleteMagicLinkLoginParam,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.service.completeMagicLinkLogin(params.token);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(
                this.configService.get("REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS"),
            ),
        });

        return { user: result.user, accessToken: result.accessToken };
    }

    @Get("access-token")
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    async getNewAccessToken(@Req() req: Request) {
        const token = req.cookies?.refreshToken;
        if (!token) throw new UnauthorizedException();

        const result = await this.service.getNewAccessToken(token);
        return { accessToken: result.accessToken, user: result.user };
    }

    @Get("google-signup")
    @UseGuards(AuthGuard(GOOGLE_SIGNUP_STRATEGY))
    initializeGoogleSignup() {}

    // TODO: if user already exists then don't create an oauth session
    @Get("google-signup/redirect")
    @UseGuards(AuthGuard(GOOGLE_SIGNUP_STRATEGY))
    async googleSignupRedirect(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = this.service.oauthSignup(req.user as User);
        if (!refreshToken) {
            return res.redirect(
                this.configService.get("OAUTH_SIGNUP_FAILURE_REDIRECT_URL"),
            );
        }

        const token = await hash(refreshToken);
        (req.user as User).oauthSignupSessionToken = token;
        await (req.user as User).save({ validateModifiedOnly: true });

        const url = process.env.OAUTH_SIGNUP_SUCCESS_REDIRECT_URL;
        return res.redirect(`${url}?token=${encodeURIComponent(token)}`);
    }
}
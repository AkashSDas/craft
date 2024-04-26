import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Req,
    Res,
    UnauthorizedException,
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { type AuthService } from "./auth.service";
import { type ConfigService } from "@nestjs/config";
import {
    InitMagicLinkLoginDto,
    type EmailSignupDto,
    CreateOAuthSessionDto,
    CompleteOAuthSignupDto,
} from "./dto";
import { type Response, type Request } from "express";
import { CompleteMagicLinkLoginParam } from "./param";
import { AccessTokenGuard, RefreshTokenGuard } from "./guard";
import { AuthGuard } from "@nestjs/passport";
import {
    GOOGLE_LOGIN_STRATEGY,
    GOOGLE_SIGNUP_STRATEGY,
} from "src/utils/constants";
import { User } from "src/users/schema";
import { hash } from "argon2";
import { InvalidOAuthLoginFilter } from "./filter";

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

    @Get("google-login")
    @UseGuards(AuthGuard(GOOGLE_LOGIN_STRATEGY))
    initializeGoogleLogin() {}

    /**
     * This will only redirect to success url because if the user is not registered
     * then filter will handle the error and redirect to failure url
     */
    @Get("google-login/redirect")
    @UseGuards(AuthGuard(GOOGLE_LOGIN_STRATEGY))
    @UseFilters(InvalidOAuthLoginFilter)
    async googleLoginRedirect(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = this.service.oauthLogin(req.user as User);
        if (!refreshToken) {
            return res.redirect(
                this.configService.get("OAUTH_LOGIN_FAILURE_REDIRECT_URL"),
            );
        }

        const token = await hash(refreshToken);
        (req.user as User).oauthSignupSessionToken = token;
        await (req.user as User).save({ validateModifiedOnly: true });

        // Redirecting to signup page and then we'll call useCreateOAuthSession with
        // the token. Once the session is created if the signup was complete then
        // isLoggedIn from useUser will become true and user will be redirected to home page
        const url = this.configService.get("OAUTH_SIGNUP_SUCCESS_REDIRECT_URL");
        return res.redirect(`${url}?token=${encodeURIComponent(token)}`);
    }

    @Post("oauth-session")
    @HttpCode(HttpStatus.OK)
    async createOAuthSession(
        @Body() dto: CreateOAuthSessionDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.service.createOAuthSession(dto);

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

    @Delete("oauth-session")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async cancelOAuthSession(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        this.service.cancelOAuthSession((req.user as User)._id);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: Number(
                this.configService.get("REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS"),
            ),
        });

        return { message: "Signup cancelled" };
    }

    @Put("oauth-session")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async completeOauthSignup(
        @Body() dto: CompleteOAuthSignupDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.service.completeOAuthSignup(
            dto,
            req.user as User,
        );

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

    @Get("logout")
    @UseGuards(AccessTokenGuard)
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        if (req.cookies?.refreshToken) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: Number(
                    this.configService.get(
                        "REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS",
                    ),
                ),
            });
        }

        if (req.logOut) {
            req.logOut(function successfulOAuthLogout() {});
        }

        return { message: "Logged out successfully" };
    }
}

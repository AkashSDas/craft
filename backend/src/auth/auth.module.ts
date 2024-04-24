import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import {
    AccessTokenStrategy,
    GoogleLoginStrategy,
    GoogleSignupStrategy,
    RefreshTokenStrategy,
} from "./strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [JwtModule.register({}), PassportModule, UserModule],
    controllers: [AuthController],
    providers: [
        AccessTokenStrategy,
        RefreshTokenStrategy,
        GoogleSignupStrategy,
        GoogleLoginStrategy,
        AuthService,
    ],
})
export class AuthModule {}

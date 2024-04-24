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

@Module({
    imports: [JwtModule.register({}), PassportModule, UserModule],
    controllers: [],
    providers: [
        AccessTokenStrategy,
        RefreshTokenStrategy,
        GoogleSignupStrategy,
        GoogleLoginStrategy,
    ],
})
export class AuthModule {}

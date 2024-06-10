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
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ReadingListsModule } from "src/reading-lists/readling-lists.module";

@Module({
    imports: [
        JwtModule.register({}),
        PassportModule,
        UserModule,
        ReadingListsModule,
    ],
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

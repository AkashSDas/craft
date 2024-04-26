import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { REFRESH_TOKEN_STRATEGY } from "src/utils/constants";

@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY) {}

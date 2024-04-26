import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACCESS_TOKEN_STRATEGY } from "src/utils/constants";

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY) {}

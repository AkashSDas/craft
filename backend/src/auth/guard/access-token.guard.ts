import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACCESS_TOKEN_STRATEGY } from "../../utils/constants";

@Injectable()
export class AccessTokenGuard extends AuthGuard(ACCESS_TOKEN_STRATEGY) {}

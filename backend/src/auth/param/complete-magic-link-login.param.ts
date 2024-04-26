import { IsNotEmpty, IsString } from "class-validator";

export class CompleteMagicLinkLoginParam {
    @IsString()
    @IsNotEmpty()
    token: string;
}

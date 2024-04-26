import { IsNotEmpty, IsString } from "class-validator";

export class CompleteOAuthSignupDto {
    @IsString()
    @IsNotEmpty()
    username: string;
}

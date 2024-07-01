import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class InitMagicLinkLoginDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsOptional()
    redirectUrl?: string;
}

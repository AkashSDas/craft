import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class InitMagicLinkLoginDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}

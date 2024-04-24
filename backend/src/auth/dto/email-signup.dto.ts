import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class EmailSignupDto {
    @Length(3, 256)
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}

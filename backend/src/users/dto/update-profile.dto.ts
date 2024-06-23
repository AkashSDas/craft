import { IsOptional, IsString } from "class-validator";
import { IUser } from "../schema";

export class UpdateProfileDto
    implements Partial<Pick<IUser, "username" | "email">>
{
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    email?: string;
}

import { IsBoolean, IsString, MinLength } from "class-validator";

export class CreateReadingListDto {
    @IsString()
    @MinLength(3, { message: "Name is too short" })
    name: string;

    @IsBoolean()
    isPrivate: boolean;
}

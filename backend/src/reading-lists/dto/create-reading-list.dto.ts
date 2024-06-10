import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateReadingListDto {
    @IsString()
    @MinLength(3, { message: "Name is too short" })
    name: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    articleIds?: string[];
}

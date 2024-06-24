import { IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateReadTimeDto {
    @IsString()
    articleId: string;

    @IsNumber()
    readTimeInMs: number;
}

import { IsString, MinLength } from "class-validator";

export class AddCommentDto {
    @IsString()
    @MinLength(3, { message: "Text is too short" })
    text: string;

    @IsString()
    articleId: string;
}

import { IsString } from "class-validator";

export class LikeArticleDto {
    @IsString()
    articleId: string;
}

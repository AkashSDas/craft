import { IsString } from "class-validator";

export class AddViewDto {
    @IsString()
    articleId: string;
}

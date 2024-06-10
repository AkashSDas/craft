import { IsArray, IsString, MinLength } from "class-validator";

export class AddArticleToReadingListsDto {
    @IsString()
    articleId: string;

    @IsArray()
    @IsString({ each: true })
    @MinLength(1, { message: "Reading list is empty" })
    readingListIds: string[];
}

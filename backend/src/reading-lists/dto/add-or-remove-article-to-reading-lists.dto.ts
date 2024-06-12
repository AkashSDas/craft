import { IsArray, IsMongoId, IsString } from "class-validator";

export class AddOrRemoveArticleToReadingListsDto {
    @IsString()
    articleId: string;

    @IsArray()
    @IsString({ each: true })
    @IsMongoId({ each: true, message: "Invalid reading list ID" })
    readingListIds: string[];
}

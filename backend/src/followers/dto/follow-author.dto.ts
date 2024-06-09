import { IsString } from "class-validator";

export class FollowAuthorDto {
    @IsString()
    followingAuthorId: string;
}

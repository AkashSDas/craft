import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { NotFoundException } from "@nestjs/common";
import { UpdateProfileDto } from "./dto";
import { AccessTokenGuard } from "src/auth/guard";
import { IRequest } from "src";

@Controller("users")
export class UserController {
    constructor(private serv: UserService) {}

    @Put("")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async updateProfile(@Body() dto: UpdateProfileDto, @Req() req: IRequest) {
        const profilePic = req.files.profilePic;
        if (Array.isArray(profilePic)) {
            throw new BadRequestException(
                "Only one profile picture is allowed",
            );
        }

        await this.serv.updateUserProfile(req.user._id, dto, profilePic);
        return { message: "Successfully updated profile" };
    }

    @Get("authors/trending")
    async getRisingAuthors(
        @Query("limit", {
            transform: (value) => {
                const limit = parseInt(value);
                if (isNaN(limit)) return 5;

                if (limit < 0) {
                    throw new BadRequestException("Invalid limit");
                } else if (limit > 10) {
                    throw new BadRequestException(
                        "Limit cannot be greater than 10",
                    );
                }

                return limit;
            },
        })
        limit: number,
    ) {
        const authors = await this.serv.getRisingAuthors(limit);
        return { authors };
    }

    @Get("authors/:authorId")
    async getAuthorProfile(@Param("authorId") authorId: string) {
        const { author, followersCount } =
            await this.serv.getAuthorProfile(authorId);

        if (!author) {
            throw new NotFoundException("Author not found");
        }

        return { author, followersCount };
    }
}

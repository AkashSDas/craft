import { Type, Transform, plainToClass } from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    IsEmpty,
    ValidateNested,
} from "class-validator";

// ====================================
// Block validators
// ====================================

class ParagraphBlockValueDto {
    @IsString()
    text: string;
}

class ParagraphBlockDto {
    @IsString()
    blockId: string;

    @IsEnum(["paragraph"])
    type: "paragraph";

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ParagraphBlockValueDto)
    value: ParagraphBlockValueDto;
}

class HeadingBlockValueDto {
    @IsString()
    text: string;

    @IsEnum(["h1", "h2", "h3"])
    variant: "h1" | "h2" | "h3";
}

class HeadingBlockDto {
    @IsString()
    blockId: string;

    @IsEnum(["heading"])
    type: "heading";

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => HeadingBlockValueDto)
    value: HeadingBlockValueDto;
}

class DividerBlockDto {
    @IsString()
    blockId: string;

    @IsEnum(["divider"])
    type: "divider";

    @IsObject()
    value: Record<string, never>;
}

class ImageBlockValueDto {
    @IsString()
    @IsEmpty()
    URL?: string;

    @IsString()
    @IsEmpty()
    @IsOptional()
    caption?: string | null | undefined;
}

class ImageBlockDto {
    @IsString()
    blockId: string;

    @IsEnum(["image"])
    type: "image";

    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ImageBlockValueDto)
    value: ImageBlockValueDto;
}

// ====================================
// Main validator
// ====================================

export class UpdateArticleContentDto {
    @IsArray()
    @IsString({ each: true })
    blockIds: string[]; // all of the block ids

    @IsArray()
    @IsString({ each: true })
    addedBlockIds: string[]; // added blocks (without deleted blocks)

    @IsArray()
    @IsString({ each: true })
    changedBlockIds: string[]; // changed blocks (without deleted or newly added blocks)

    @IsObject()
    @Transform(({ value }) => {
        console.count("Transform");
        const result = Object.fromEntries(
            Object.entries(value)
                .filter(([, value]) => (value as any)?.type)
                .map(([key, value]) => {
                    switch ((value as any).type) {
                        case "paragraph":
                            return [
                                key,
                                plainToClass(ParagraphBlockDto, value),
                            ];
                        case "heading":
                            return [key, plainToClass(HeadingBlockDto, value)];
                        case "divider":
                            return [key, plainToClass(DividerBlockDto, value)];
                        case "image":
                            return [key, plainToClass(ImageBlockDto, value)];
                        default:
                            return [key, null];
                    }
                })
                .filter(([, value]) => value !== null),
        );

        return result;
    })
    // @ValidateNested({ each: true })
    // @Type(() => Object, {
    //     discriminator: {
    //         property: "type",
    //         subTypes: [
    //             { value: ParagraphBlockDto, name: "paragraph" },
    //             { value: HeadingBlockDto, name: "heading" },
    //             { value: DividerBlockDto, name: "divider" },
    //             { value: ImageBlockDto, name: "image" },
    //         ],
    //     },
    // })
    blocks: Record<
        string,
        ParagraphBlockDto | HeadingBlockDto | DividerBlockDto | ImageBlockDto
    >;
}

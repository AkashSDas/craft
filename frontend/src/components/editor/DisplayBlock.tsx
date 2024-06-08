import { Block } from "@app/services/articles";
import { DividerBlock } from "./DividerBlock";
import { HeadingBlock } from "./HeadingBlock";
import { ImageBlock } from "./ImageBlock";
import { ParagraphInputBlock } from "./ParagraphInputBlock";
import { QuoteBlock } from "./QuoteBlock";

type Props = {
    block: Block;
    index: number;
};

export function DisplayBlock({ block, index }: Props) {
    switch (block.type) {
        case "paragraph":
            return (
                <ParagraphInputBlock
                    key={block.blockId}
                    blockId={block.blockId}
                    index={index}
                />
            );
        case "heading": {
            const { variant } = block.value;
            return (
                <HeadingBlock
                    key={block.blockId}
                    blockId={block.blockId}
                    variant={variant}
                    index={index}
                />
            );
        }
        case "divider":
            return (
                <DividerBlock
                    key={block.blockId}
                    blockId={block.blockId}
                    index={index}
                />
            );
        case "image":
            return (
                <ImageBlock
                    key={block.blockId}
                    blockId={block.blockId}
                    index={index}
                />
            );
        case "quote":
            return (
                <QuoteBlock
                    key={block.blockId}
                    blockId={block.blockId}
                    index={index}
                />
            );
        default:
            return null;
    }
}

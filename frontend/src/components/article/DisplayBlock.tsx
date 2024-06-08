import { Block } from "@app/services/articles";
import { ParagraphBlock } from "./ParagraphBlock";
import { HeadingBlock } from "./HeadingBlock";
import { DividerBlock } from "./DividerBlock";
import { ImageBlock } from "./ImageBlock";

type Props = {
    block: Block;
};

export function DisplayBlock({ block }: Props): React.JSX.Element | null {
    switch (block.type) {
        case "paragraph":
            return <ParagraphBlock block={block} />;
        case "heading":
            return <HeadingBlock block={block} />;
        case "divider":
            return <DividerBlock />;
        case "image":
            return <ImageBlock block={block} />;
        default:
            return null;
    }
}

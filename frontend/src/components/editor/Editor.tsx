import { Box, Stack, Text } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@app/hooks/store";
import { selectBlockIds, selectBlocks } from "@app/store/editor/slice";
import { Block } from "@app/services/articles";
import { ParagraphInputBlock } from "./ParagraphInputBlock";
import { HeadingBlock } from "./HeadingBlock";
import { DividerBlock } from "./DividerBlock";
import { ImageBlock } from "./ImageBlock";

export function Editor() {
    const blocks = useAppSelector(selectBlocks);
    const blockIds = useAppSelector(selectBlockIds);

    return (
        <Box pos="relative" mt="70px">
            <Sidebar />
            <Stack ml="300px" alignItems="center">
                <Stack maxW="700px" w="100%" px="4rem" my="2rem" gap="0">
                    {blockIds.map(function (id) {
                        const block = blocks[id];
                        return <DisplayBlock key={id} block={block} />;
                    })}
                </Stack>
            </Stack>
        </Box>
    );
}

function DisplayBlock({ block }: { block: Block }) {
    switch (block.type) {
        case "paragraph":
            return <ParagraphInputBlock blockId={block.blockId} />;
        case "heading": {
            const { variant } = block.value;
            return <HeadingBlock blockId={block.blockId} variant={variant} />;
        }
        case "divider":
            return <DividerBlock blockId={block.blockId} />;
        case "image":
            return <ImageBlock blockId={block.blockId} />;
        default:
            return null;
    }
}

import { Box, Stack, Text } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@app/hooks/store";
import { selectBlockIds, selectBlocks } from "@app/store/editor/slice";

export function Editor() {
    const blocks = useAppSelector(selectBlocks);
    const blockIds = useAppSelector(selectBlockIds);

    return (
        <Box pos="relative">
            <Sidebar />
            <Stack>
                {blockIds.map(function (id) {
                    const block = blocks[id];
                    return <Text key={id}>{block.type}</Text>;
                })}
            </Stack>
        </Box>
    );
}

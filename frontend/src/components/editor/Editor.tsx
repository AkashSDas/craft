import { Box, Button, Spinner, Stack } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { useAppDispatch, useAppSelector } from "@app/hooks/store";
import {
    reorderBlocks,
    selectBlockIds,
    selectBlocks,
} from "@app/store/editor/slice";
import { useSaveArticle } from "@app/hooks/editor";
import { DisplayBlock } from "./DisplayBlock";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

export function Editor() {
    const blocks = useAppSelector(selectBlocks);
    const blockIds = useAppSelector(selectBlockIds);
    const { save, saveIsPending, reorder, reorderIsPending } = useSaveArticle();
    const dispatch = useAppDispatch();

    async function onDragEnd(dropEvent: DropResult) {
        const source = dropEvent.source.index;
        const destination = dropEvent.destination?.index;
        if (destination === undefined) return;
        dispatch(reorderBlocks({ from: source, to: destination }));

        const tmpBlockIds = [...blockIds];
        const [removed] = tmpBlockIds.splice(source, 1);
        tmpBlockIds.splice(destination, 0, removed);
        await reorder(tmpBlockIds);
    }

    return (
        <Box pos="relative" mt="70px">
            <Sidebar />
            <Stack ml="300px" alignItems="center">
                <Stack maxW="700px" w="100%" px="4rem" my="2rem" gap="0">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {function (provided) {
                                return (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {blockIds.map(function (id, index) {
                                            const block = blocks[id];
                                            return (
                                                <DisplayBlock
                                                    key={id}
                                                    block={block}
                                                    index={index}
                                                />
                                            );
                                        })}

                                        {provided.placeholder}
                                    </Box>
                                );
                            }}
                        </Droppable>
                    </DragDropContext>

                    <Button mt="2rem" onClick={save} disabled={saveIsPending}>
                        {saveIsPending || reorderIsPending ? (
                            <Spinner />
                        ) : (
                            "Save"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

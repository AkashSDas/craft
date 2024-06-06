import {
    Divider,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
} from "@chakra-ui/react";
import { useAppDispatch } from "@app/hooks/store";
import { useState } from "react";
import { deleteBlock } from "@app/store/editor/slice";
import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Draggable } from "react-beautiful-dnd";
import { DragHandler } from "./DragHandler";

type Props = {
    blockId: string;
    index: number;
};

export function DividerBlock(props: Props) {
    const { blockId } = props;
    const dispatch = useAppDispatch();
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <Draggable
            key={props.blockId}
            draggableId={props.blockId}
            index={props.index}
        >
            {function (provided, snapshot) {
                return (
                    <Stack
                        pos="relative"
                        role="group"
                        mt="1rem"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <Menu onClose={() => setMenuOpen(false)}>
                            <MenuButton
                                as={DragHandler}
                                opacity={isMenuOpen ? 1 : 0}
                                transition="opacity 0.1.5s ease-in-out"
                                _groupHover={{ opacity: 1 }}
                                width="fit-content"
                                variant="paleSolid"
                                onClick={() => setMenuOpen(true)}
                                aria-label="Drag"
                                fontSize="smaller"
                                pos="absolute"
                                left="-32px"
                                top="30%"
                                h="28px"
                                w="24px"
                                p="0"
                                minW="22px"
                                maxW="22px"
                                {...provided.dragHandleProps}
                            >
                                <DragHandleIcon color="gray" />
                            </MenuButton>

                            <MenuList
                                bgColor="white"
                                border="1.5px solid"
                                mt="12px"
                                py="8px"
                                px="0px"
                                borderColor="gray.300"
                                borderRadius="4px"
                                boxShadow="0px 4px 8px rgba(57, 57, 57, 0.25)"
                            >
                                <MenuItem
                                    h="36px"
                                    borderRadius="4px"
                                    fontSize="14px"
                                    color="gray.400"
                                    fontWeight="medium"
                                    _hover={{
                                        bgColor: "gray.100",
                                        color: "red.500",
                                    }}
                                    _active={{ bgColor: "gray.200" }}
                                    onClick={() =>
                                        dispatch(deleteBlock(blockId))
                                    }
                                    icon={<DeleteIcon fontSize="medium" />}
                                >
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>

                        <Divider my="2rem" />
                    </Stack>
                );
            }}
        </Draggable>
    );
}

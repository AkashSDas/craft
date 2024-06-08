import { useAppDispatch, useAppSelector } from "@app/hooks/store";
import { Quote } from "@app/services/articles";
import {
    selectBlock,
    deleteBlock,
    updateQuoteBlock,
} from "@app/store/editor/slice";
import { DragHandleIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    Stack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Textarea,
    Box,
} from "@chakra-ui/react";
import { useRef, useState, ChangeEvent } from "react";
import { Draggable } from "react-beautiful-dnd";
import { DragHandler } from "./DragHandler";
import ResizeTextarea from "react-textarea-autosize";

type Props = {
    blockId: string;
    index: number;
};

export function QuoteBlock(props: Props): React.JSX.Element {
    const { blockId } = props;
    const dispatch = useAppDispatch();
    const block = useAppSelector(
        (state) => selectBlock(state, blockId) as Quote
    );
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isInputFocused, setInputFocused] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        dispatch(updateQuoteBlock({ blockId, text: e.target.value }));
    }

    function handleFocus() {
        setInputFocused(true);
    }

    function handleBlur() {
        setInputFocused(false);
    }

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
                            <Box>
                                <MenuButton
                                    as={DragHandler}
                                    isDragging={snapshot.isDragging}
                                    opacity={
                                        isInputFocused || isMenuOpen ? 1 : 0
                                    }
                                    transition="opacity 0.1.5s ease-in-out"
                                    _groupHover={{ opacity: 1 }}
                                    width="fit-content"
                                    variant="paleSolid"
                                    onClick={() => setMenuOpen(true)}
                                    aria-label="Drag"
                                    fontSize="smaller"
                                    pos="absolute"
                                    left="-32px"
                                    top="8px"
                                    h="28px"
                                    w="24px"
                                    p="0"
                                    minW="22px"
                                    maxW="22px"
                                    {...provided.dragHandleProps}
                                >
                                    <DragHandleIcon color="gray" h="100%" />
                                </MenuButton>
                            </Box>

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

                        <Textarea
                            ref={inputRef}
                            minH="unset"
                            overflow="hidden"
                            w="100%"
                            resize="none"
                            minRows={1}
                            as={ResizeTextarea}
                            value={block.value.text}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            transition="height none"
                            color="gray"
                            fontStyle="italic"
                            fontSize="24px"
                            border="1.5px solid"
                            borderColor="gray.100"
                            fontFamily="serif"
                            _focus={{
                                boxShadow: "none",
                                border: "1.5px solid",
                                borderColor: "black",
                            }}
                            {...(props ?? {})}
                        />
                    </Stack>
                );
            }}
        </Draggable>
    );
}

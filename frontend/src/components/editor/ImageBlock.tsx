import {
    Box,
    Button,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@app/hooks/store";
import { ChangeEvent, useRef, useState } from "react";
import {
    deleteBlock,
    selectBlock,
    selectFile,
    updateImageBlock,
} from "@app/store/editor/slice";
import { AddIcon, DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Image } from "@app/services/articles";
import NextImage from "next/image";
import { Draggable } from "react-beautiful-dnd";
import { DragHandler } from "./DragHandler";

type Props = {
    blockId: string;
    index: number;
};

export function ImageBlock(props: Props) {
    const { blockId } = props;
    const block = useAppSelector((s) => selectBlock(s, blockId) as Image);
    const file = useAppSelector((s) => selectFile(s, block.blockId));
    const dispatch = useAppDispatch();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            dispatch(updateImageBlock({ blockId, file }));
        }
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
                            <MenuButton
                                as={DragHandler}
                                isDragging={snapshot.isDragging}
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
                                top="6px"
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

                        <input
                            type="file"
                            ref={inputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {/* Add file type and file size validation */}
                        {file || block?.value?.URL ? (
                            <Box pos="relative" height="300px" width="100%">
                                <NextImage
                                    src={block?.value?.URL ?? ""}
                                    alt="Image"
                                    layout="fill"
                                    style={{
                                        borderRadius: "4px",
                                        objectFit: "cover",
                                        border: "1.5px solid black",
                                    }}
                                />

                                <Button
                                    size="sm"
                                    variant="paleSolid"
                                    pos="absolute"
                                    bottom="8px"
                                    right="8px"
                                    onClick={() => inputRef.current?.click()}
                                >
                                    Update
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant="paleSolid"
                                leftIcon={<AddIcon />}
                                onClick={() => inputRef.current?.click()}
                            >
                                Add Image
                            </Button>
                        )}
                    </Stack>
                );
            }}
        </Draggable>
    );
}

import { ReadingListType } from "@app/services/reading-lists";
import {
    Box,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { UserChip } from "../shared/user-chip/UserChip";
import { useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useReadingListsManager } from "@app/hooks/reading-lists";
import { ReadingListUpdateInput } from "./ReadingListUpdateInput";
import { ReadingListUpdateDrawer } from "./ReadingListUpdateDrawer";

type Props = {
    onClick: () => void;
    readingList: ReadingListType;
    isActive?: boolean;
    actionItems?: React.JSX.Element | null;
    isReadingLater: boolean;
};

export function ReadingListCard(props: Props): React.JSX.Element {
    const { isActive, actionItems, isReadingLater } = props;
    const { name, createdAt, userId: user } = props.readingList;
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { deleteReadingListMutation } = useReadingListsManager();
    const editDrawer = useDisclosure();

    return (
        <HStack
            flexDir={{ base: "column", sm: "row" }}
            alignItems="start"
            borderRadius="4px"
            pos="relative"
            p="6px"
            border="2px solid"
            borderColor={isActive ? "black" : "gray.200"}
            bgColor={isActive ? "gray.100" : "transparent"}
            w="100%"
            cursor="pointer"
            _hover={{
                bgColor: isActive ? "gray.100" : "gray.50",
                borderColor: isActive ? "black" : "gray.300",
            }}
            _active={{
                bgColor: "gray.100",
                borderColor: "black",
            }}
            role="group"
        >
            <HStack
                flexDir={{ base: "column", sm: "row" }}
                role="group"
                w="100%"
                alignItems="start"
                transition="all 0.2s ease-in-out"
                transformOrigin="center"
                _active={{
                    transform: "scale(0.98)",
                }}
                onClick={props.onClick}
            >
                <Box
                    pos="relative"
                    w={{ base: "100%", sm: "240px" }}
                    maxW={{ base: "100%", sm: "240px" }}
                    minW={{ base: "100%", sm: "240px" }}
                    h={{ base: "180px", sm: "130px" }}
                >
                    <Image
                        src={
                            !isReadingLater
                                ? "/default-cover.png"
                                : "/default-cover-light.png"
                        }
                        alt="Cover image"
                        fill
                        style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                </Box>

                <VStack gap="12px" alignItems="start" w="100%">
                    <UserChip
                        username={user.username}
                        userId={user.userId}
                        alt="User avatar"
                        avatarURL={user.profilePic.URL}
                    />

                    <VStack gap="0px" alignItems="start" w="100%">
                        <Text
                            fontSize="1.25rem"
                            fontWeight="bold"
                            noOfLines={2}
                        >
                            {name}
                        </Text>
                        <Text
                            fontSize="13px"
                            color="gray.400"
                            mt="2px"
                            fontWeight="500"
                        >
                            Created on {new Date(createdAt).toDateString()}
                        </Text>
                    </VStack>
                </VStack>
            </HStack>

            {actionItems || actionItems === null ? (
                actionItems
            ) : (
                <Menu onClose={() => setMenuOpen(false)}>
                    <MenuButton
                        pos={{ base: "absolute", sm: "static" }}
                        right={{ base: "18px", sm: "auto" }}
                        top={{ base: "18px", sm: "auto" }}
                        as={IconButton}
                        aria-label="More options"
                        variant="paleSolid"
                        w="40px"
                        h="32px"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(true);
                        }}
                        opacity={{ base: 1, sm: isMenuOpen ? 1 : 0 }}
                        _groupHover={{ opacity: 1 }}
                        transition="opacity 0.2s ease-in-out"
                        sx={{
                            "& span": {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        }}
                    >
                        <Image
                            src="/icons/more-horizontal.png"
                            alt="More options"
                            height={18}
                            width={18}
                        />
                    </MenuButton>

                    <MenuList
                        bgColor="white"
                        border="1.5px solid"
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
                            _hover={{ bgColor: "gray.100", color: "gray.500" }}
                            _active={{ bgColor: "gray.200" }}
                            onClick={() => editDrawer.onOpen()}
                            icon={
                                <Image
                                    src="/icons/edit.png"
                                    alt="Edit reading list"
                                    height={18}
                                    width={18}
                                />
                            }
                        >
                            Edit
                        </MenuItem>

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
                            isDisabled={deleteReadingListMutation.isPending}
                            onClick={async () => {
                                await deleteReadingListMutation.mutateAsync(
                                    props.readingList._id
                                );
                            }}
                            icon={
                                deleteReadingListMutation.isPending ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <DeleteIcon fontSize="medium" />
                                )
                            }
                        >
                            Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            )}

            <ReadingListUpdateDrawer
                readingListId={props.readingList._id}
                isOpen={editDrawer.isOpen}
                onClose={editDrawer.onClose}
                defaultValues={{
                    name,
                    isPrivate: props.readingList.isPrivate,
                }}
            />
        </HStack>
    );
}

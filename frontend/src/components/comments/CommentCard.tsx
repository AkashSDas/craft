import { GetComment } from "@app/services/comments";
import { DeleteIcon } from "@chakra-ui/icons";
import {
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
    comment: GetComment[number];
};

export function CommentCard({ comment }: Props) {
    const { author } = comment;
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <HStack w="100%" role="group" alignItems="start" gap="1rem">
            <Link href={`/authors/${author.userId}`}>
                <Image
                    src={author.profilePic?.URL ?? "/mascot.png"}
                    alt={`Author ${author.username}`}
                    height={36}
                    width={36}
                    style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #d67844",
                    }}
                />
            </Link>

            <VStack flexGrow={1} w="100%" alignItems="start" gap="0px">
                <HStack>
                    <Text fontWeight="600" fontSize="14px">
                        {author.username}
                    </Text>
                    <Text fontSize="14px" color="gray">
                        {new Date(comment.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}
                    </Text>
                </HStack>

                <Text>{comment.text}</Text>
            </VStack>

            <Menu onClose={() => setMenuOpen(false)}>
                <MenuButton
                    as={IconButton}
                    aria-label="More options"
                    variant="paleSolid"
                    w="40px"
                    h="32px"
                    onClick={(e) => setMenuOpen(true)}
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
                        _hover={{
                            bgColor: "gray.100",
                            color: "red.500",
                        }}
                        _active={{ bgColor: "gray.200" }}
                        onClick={() => {}}
                        icon={<DeleteIcon fontSize="medium" />}
                    >
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    );
}

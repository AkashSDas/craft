import { useUser } from "@app/hooks/auth";
import { useCommentsManager } from "@app/hooks/comments";
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
    articleId: string;
};

export function CommentCard({ comment, articleId }: Props) {
    const { author } = comment;
    const { user } = useUser();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { deleteCommentMutation, reportCommentMutation } =
        useCommentsManager(articleId);

    return (
        <HStack w="100%" role="group" alignItems="start" gap="1rem">
            <Link href={`/authors/${author.userId}`}>
                <Image
                    src={author.profilePic?.URL ?? "/mascot.png"}
                    alt={`Author ${author.username}`}
                    height={36}
                    width={36}
                    style={{
                        width: "36px",
                        minWidth: "36px",
                        height: "36px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid #d67844",
                    }}
                />
            </Link>

            <VStack flexGrow={1} w="100%" alignItems="start" gap="0px">
                <HStack>
                    <Text
                        fontWeight="600"
                        fontSize="14px"
                        as={Link}
                        href={`/authors/${author.userId}`}
                    >
                        {author.username}
                    </Text>
                    <Text fontSize="14px" color="gray" fontWeight="500">
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
                        _hover={{ bgColor: "gray.100" }}
                        _active={{ bgColor: "gray.200" }}
                        isDisabled={reportCommentMutation.isPending}
                        onClick={async () => {
                            await reportCommentMutation.mutateAsync(
                                comment._id
                            );
                        }}
                        icon={
                            <Image
                                src="/icons/dislike.png"
                                alt="Report"
                                height={18}
                                width={18}
                            />
                        }
                    >
                        Report
                    </MenuItem>

                    {user?.userId === author.userId ? (
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
                            isDisabled={deleteCommentMutation.isPending}
                            onClick={async () => {
                                await deleteCommentMutation.mutateAsync(
                                    comment._id
                                );
                            }}
                            icon={<DeleteIcon fontSize="medium" />}
                        >
                            Delete
                        </MenuItem>
                    ) : null}
                </MenuList>
            </Menu>
        </HStack>
    );
}

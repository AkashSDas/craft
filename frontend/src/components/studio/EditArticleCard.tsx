import {
    Article,
    Heading,
    Image as ImageBlock,
    Paragraph,
} from "@app/services/articles";
import {
    HStack,
    VStack,
    IconButton,
    Text,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useMakeArticlePublic } from "@app/hooks/editor";
import { useDeleteArticle } from "@app/hooks/articles";

type EditArticleCardProps = {
    article: Article;
};

export function EditArticleCard(props: EditArticleCardProps) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const firstImgBlockURL = useMemo(
        function () {
            if (props.article.coverImage?.URL) {
                return props.article.coverImage.URL;
            }
            const block = Object.values(props.article.blocks).find(
                (block) => block.type === "image"
            ) as ImageBlock | undefined;

            if (block?.value?.URL) {
                return block.value.URL;
            } else {
                return "/default-cover.png";
            }
        },
        [props.article]
    );
    const heading = useMemo(
        function () {
            if (props.article.headline) {
                return props.article.headline;
            }
            const block = Object.values(props.article.blocks).find(
                (block) =>
                    block.type === "heading" && block.value.variant === "h1"
            ) as Heading | undefined;

            if (block?.value.text) {
                return block.value.text;
            } else {
                return "Untitled";
            }
        },
        [props.article]
    );
    const about = useMemo(
        function () {
            if (props.article.description) {
                return props.article.description;
            }
            const block = Object.values(props.article.blocks).find(
                (block) => block.type === "paragraph"
            ) as Paragraph | undefined;

            if (block?.value.text) {
                return block.value.text;
            } else {
                return "No description";
            }
        },
        [props.article]
    );

    const { mutation: makeArticlePublic } = useMakeArticlePublic();
    const { isPending, delete: deleteArticle } = useDeleteArticle();

    return (
        <HStack
            flexDir={{ base: "column", sm: "row" }}
            alignItems="start"
            borderRadius="4px"
            pos="relative"
            p="6px"
            border="2px solid"
            borderColor="gray.200"
            w="100%"
            cursor="pointer"
            _hover={{
                bgColor: "gray.50",
                borderColor: "gray.300",
            }}
            _active={{
                bgColor: "gray.100",
                borderColor: "black",
            }}
            role="group"
        >
            <HStack
                as={Link}
                href={`/articles/${props.article.articleId}/edit`}
                flexDir={{ base: "column", sm: "row" }}
                role="group"
                w="100%"
                alignItems="start"
                transition="all 0.2s ease-in-out"
                transformOrigin="center"
                _active={{
                    transform: "scale(0.98)",
                }}
            >
                <Box
                    pos="relative"
                    w={{ base: "100%", sm: "240px" }}
                    maxW={{ base: "100%", sm: "240px" }}
                    minW={{ base: "100%", sm: "240px" }}
                    h={{ base: "180px", sm: "130px" }}
                >
                    <Image
                        src={firstImgBlockURL}
                        alt="Cover image"
                        fill
                        style={{ borderRadius: "4px", objectFit: "cover" }}
                    />
                </Box>

                <VStack gap="0px" alignItems="start" w="100%">
                    <Text fontSize="1.25rem" fontWeight="bold" noOfLines={2}>
                        {heading}
                    </Text>
                    <Text
                        fontSize="14px"
                        color="gray.500"
                        mt="2px"
                        noOfLines={2}
                        fontWeight="500"
                    >
                        {about}
                    </Text>
                    <Text
                        fontSize="13px"
                        color="gray.400"
                        mt="2px"
                        fontWeight="500"
                    >
                        Last edited on{" "}
                        {new Date(props.article.lastUpdatedAt).toDateString()}
                    </Text>
                </VStack>
            </HStack>

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
                        isDisabled={makeArticlePublic.isPending}
                        onClick={async () => {
                            await makeArticlePublic.mutateAsync(
                                props.article.articleId
                            );
                        }}
                        icon={
                            makeArticlePublic.isPending ? (
                                <Spinner size="sm" color="gray.400" />
                            ) : (
                                <Image
                                    src="/icons/globe.png"
                                    alt="Publish article"
                                    height={18}
                                    width={18}
                                />
                            )
                        }
                    >
                        Publish
                    </MenuItem>

                    <MenuItem
                        h="36px"
                        borderRadius="4px"
                        fontSize="14px"
                        color="gray.400"
                        fontWeight="medium"
                        _hover={{ bgColor: "gray.100", color: "gray.500" }}
                        _active={{ bgColor: "gray.200" }}
                        as={Link}
                        href={`/articles/${props.article.articleId}`}
                        icon={
                            <Image
                                src="/icons/eye.png"
                                alt="Preview article"
                                height={18}
                                width={18}
                            />
                        }
                    >
                        Preview
                    </MenuItem>

                    <MenuItem
                        h="36px"
                        borderRadius="4px"
                        fontSize="14px"
                        color="gray.400"
                        fontWeight="medium"
                        _hover={{ bgColor: "gray.100", color: "gray.500" }}
                        _active={{ bgColor: "gray.200" }}
                        as={Link}
                        href={`/articles/${props.article.articleId}/edit`}
                        icon={
                            <Image
                                src="/icons/edit.png"
                                alt="Edit article"
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
                        onClick={() => deleteArticle(props.article.articleId)}
                        disabled={isPending}
                        icon={<DeleteIcon fontSize="medium" />}
                    >
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </HStack>
    );
}

import { ArticlePreview } from "@app/services/reading-lists";
import {
    Box,
    Divider,
    HStack,
    Text,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import { Image as ImageBlock } from "@app/services/articles";
import { ControlPanel } from "./ControlPanel";
import { CommentsDrawer } from "@app/components/comments/CommentsDrawer";
import { ReadingListsDrawer } from "@app/components/reading-lists/ReadingListsDrawer";
import Link from "next/link";
import dynamic from "next/dynamic";
import { HightlightWrapper } from "./HighlightWrapper";

// Since on home page with SSR when articles are loaded, ArticlePreviewCard is
// a link and UserChip is also a link (<a> inside <a> giving hydration err).
// To avoid this hydration err, I'm just disabling prerendering on UserChip
const UserChip = dynamic(
    () =>
        import("../user-chip/UserChip").then((mod) => {
            return {
                default: mod.UserChip,
            };
        }),
    { ssr: false }
);

type Props = {
    article: Omit<ArticlePreview, "_id">;
    likeCount: number;
    searchTextHighlight?: string;
};

export function ArticlePreviewCard(props: Props): React.JSX.Element {
    const { article, likeCount, searchTextHighlight } = props;
    const { authorIds, headline, description, readTimeInMs, lastUpdatedAt } =
        article;
    const user = authorIds[0];
    const comments = useDisclosure();
    const readingLists = useDisclosure();

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

    return (
        <HStack
            as={Link}
            href={`/articles/${props.article.articleId}`}
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
                textDecoration: "none",
            }}
            _active={{
                bgColor: "gray.100",
                borderColor: "black",
                transform: "scale(0.98)",
            }}
            transition="transform .3s cubic-bezier(.5,2.5,.7,.7),-webkit-transform .3s cubic-bezier(.5,2.5,.7,.7)"
            transformOrigin="center"
            role="group"
        >
            <HStack
                flexDir={{ base: "column", sm: "row" }}
                role="group"
                w="100%"
                alignItems="start"
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

                <VStack gap="12px" alignItems="start" w="100%">
                    <HStack w="100%" justifyContent="space-between">
                        <UserChip
                            username={user.username}
                            userId={user.userId}
                            alt="User avatar"
                            avatarURL={user.profilePic?.URL ?? "/mascot.png"}
                        />

                        <HStack>
                            <Text
                                fontSize="13px"
                                color="gray.400"
                                mt="2px"
                                fontWeight="500"
                            >
                                {new Date(lastUpdatedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </Text>

                            <Divider
                                orientation="vertical"
                                h="12px"
                                w="1px"
                                borderColor="gray.300"
                            />

                            <Text
                                fontSize="13px"
                                color="gray.400"
                                mt="2px"
                                fontWeight="500"
                            >
                                {readTimeInMs}min read
                            </Text>
                        </HStack>
                    </HStack>

                    <VStack gap="0px" alignItems="start" w="100%">
                        <Text
                            fontSize="1.25rem"
                            fontWeight="bold"
                            noOfLines={2}
                        >
                            <HightlightWrapper query={searchTextHighlight}>
                                {headline ?? "Untitled"}
                            </HightlightWrapper>
                        </Text>

                        <Text fontSize="1rem" color="gray" noOfLines={2}>
                            <HightlightWrapper query={searchTextHighlight}>
                                {description ?? ""}
                            </HightlightWrapper>
                        </Text>
                    </VStack>

                    <ControlPanel
                        article={article}
                        likeCount={likeCount}
                        openCommentsDrawer={(e) => {
                            e.preventDefault();
                            comments.onOpen();
                        }}
                        openReadingListsDrawer={(e) => {
                            e.preventDefault();
                            readingLists.onOpen();
                        }}
                    />
                </VStack>
            </HStack>

            <CommentsDrawer
                isOpen={comments.isOpen}
                onClose={comments.onClose}
                articleId={article.articleId}
            />
            <ReadingListsDrawer
                isOpen={readingLists.isOpen}
                onClose={readingLists.onClose}
                articleId={article.articleId}
            />
        </HStack>
    );
}

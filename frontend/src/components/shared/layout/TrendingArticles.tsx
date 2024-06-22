import { useGetTrendingArticles } from "@app/hooks/articles";
import {
    VStack,
    Heading,
    Divider,
    Skeleton,
    Text,
    HStack,
    SkeletonText,
} from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";
import { UserChip } from "../user-chip/UserChip";
import Link from "next/link";

export function TrendingArticles() {
    const { isLoading, isError, articles } = useGetTrendingArticles();
    const isLoaded = useMemo(
        function () {
            return !isLoading && !isError;
        },
        [isLoading, isError]
    );

    console.log({ articles });

    return (
        <VStack w="100%" alignItems="start" gap="14px">
            <Heading variant="h3" fontSize="24px">
                Trending
            </Heading>

            <Divider />

            {!isLoaded ? <ArticleSkeletons isLoaded={isLoaded} /> : null}

            {articles.map((art) => {
                const author = art.authorIds[0];

                return (
                    <HStack
                        w="100%"
                        p="2px"
                        gap="12px"
                        alignItems="start"
                        as={Link}
                        href={`/articles/${art.articleId}`}
                        key={art.articleId}
                        transition="transform 0.3s cubic-bezier(.5,2.5,.7,.7)"
                        _hover={{
                            borderColor: "gray.300",
                            bgColor: "gray.100",
                        }}
                        _active={{
                            transform: "scale(0.98)",
                            borderColor: "gray.900",
                            bgColor: "gray.200",
                        }}
                        border="1.5px solid"
                        borderColor="gray.200"
                        borderRadius="4px"
                    >
                        <Image
                            src={art.coverImage?.URL ?? "/default-cvoer.png"}
                            alt="Article cover"
                            height={96}
                            width={190}
                            style={{
                                maxHeight: "96px",
                                minWidth: "190px",
                                objectFit: "cover",
                                borderRadius: "4px",
                            }}
                        />

                        <VStack
                            w="100%"
                            alignItems="start"
                            flexGrow={1}
                            gap="12px"
                        >
                            <UserChip
                                avatarURL={
                                    author.profilePic?.URL ?? "/mascot.png"
                                }
                                alt={author.username}
                                username={author.username}
                                userId={author.userId}
                            />

                            <Text
                                noOfLines={2}
                                fontWeight="600"
                                color="gray.700"
                            >
                                {art.headline}
                            </Text>
                        </VStack>
                    </HStack>
                );
            })}
        </VStack>
    );
}

function ArticleSkeletons(props: { isLoaded: boolean }) {
    return (
        <>
            {[1, 2, 3].map((item) => {
                return (
                    <HStack w="100%" p="2px" gap="12px" alignItems="start">
                        <Skeleton
                            isLoaded={props.isLoaded}
                            h="96px"
                            minW="190px"
                            borderRadius="4px"
                            startColor="gray.100"
                            endColor="gray.300"
                            fadeDuration={0.5}
                        />

                        <VStack
                            w="100%"
                            alignItems="start"
                            flexGrow={1}
                            gap="12px"
                        >
                            <Skeleton
                                isLoaded={props.isLoaded}
                                h="28px"
                                w="100px"
                                borderRadius="20px"
                                startColor="gray.100"
                                endColor="gray.300"
                                fadeDuration={0.5}
                            />

                            <SkeletonText
                                isLoaded={props.isLoaded}
                                noOfLines={2}
                                skeletonHeight="3"
                                w="100%"
                                borderRadius="4px"
                                startColor="gray.100"
                                endColor="gray.300"
                                fadeDuration={0.5}
                            />
                        </VStack>
                    </HStack>
                );
            })}
        </>
    );
}

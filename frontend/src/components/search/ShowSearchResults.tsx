import { PaginatedArticle, getArticlesPaginated } from "@app/services/articles";
import { fontStyles } from "@app/utils/fonts";
import {
    VStack,
    Heading,
    HStack,
    Spinner,
    Spacer,
    Text,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArticlePreviewCard } from "../shared/article-preview-card/ArticlePreviewCard";

const LIMIT = 5;
const INITIAL_OFFSET = 0;

type Props = {
    articles: PaginatedArticle[];
    likes: Record<string, number>;
    totalCount: number;
    nextOffset: number;
};

export function ShowSearchResults(props: Props) {
    const { articles, likes, totalCount, nextOffset } = props;
    const router = useRouter();

    const {
        data,
        error,
        isError,
        fetchNextPage,
        hasNextPage,
        status,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["articlesPaginated", router.query.q],
        queryFn: ({ pageParam }) => {
            return getArticlesPaginated(
                LIMIT,
                pageParam,
                router.query.q as string
            );
        },
        enabled: !!router.query.q,
        // initialPageParam: INITIAL_OFFSET + LIMIT, // as we've fetched first page in SSR
        // same as below (due to backend)
        initialPageParam: INITIAL_OFFSET,
        getNextPageParam: (lastPage, allPages) => {
            const lastPageLength = lastPage.articles?.length;
            if (lastPageLength) {
                if (lastPageLength < LIMIT) {
                    return undefined;
                } else {
                    return lastPage.nextOffset ?? 0;
                }
            }
        },
        initialData: {
            pageParams: [INITIAL_OFFSET],
            pages: [
                {
                    success: true,
                    articles: props.articles,
                    totalCount: props.totalCount,
                    likes: props.likes,
                    nextOffset: props.nextOffset,
                },
            ],
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const dataLength = useMemo(
        function () {
            return data.pages.reduce(
                (a, b) => a + (b.articles?.length ?? 0),
                0
            );
        },
        [data]
    );

    return (
        <VStack
            gap="1rem"
            alignItems="start"
            w="100%"
            className="search-results"
        >
            <Heading variant="h3">
                <ResultsForHeading />
                <Text as="span" ml="6px">
                    {router.query.q ?? "search"}
                </Text>
            </Heading>

            <InfiniteScroll
                dataLength={dataLength}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={
                    isFetchingNextPage ? (
                        <HStack
                            w="100%"
                            justifyContent="center"
                            mb="2rem"
                            mt="1rem"
                        >
                            <Spinner />
                        </HStack>
                    ) : null
                }
                endMessage={
                    <HStack
                        w="100%"
                        justifyContent="center"
                        mb="2rem"
                        mt="1rem"
                    >
                        <Text
                            textAlign="center"
                            color="gray.500"
                            fontWeight="500"
                        >
                            {dataLength === 0
                                ? "No results found"
                                : "Yay! You have seen it all"}
                        </Text>
                    </HStack>
                }
            >
                {data?.pages.map((page) => {
                    return (page.articles ?? [])
                        .filter(Boolean)
                        .map((article) => {
                            let likeCount = 0;
                            if (page.likes) {
                                likeCount = page.likes[article._id] ?? 0;
                            }

                            let highText: string | undefined = undefined;
                            if (typeof router.query.q === "string") {
                                highText = router.query.q;
                            }

                            return (
                                <>
                                    <ArticlePreviewCard
                                        key={article.articleId}
                                        article={article}
                                        likeCount={likeCount}
                                        searchTextHighlight={highText}
                                    />

                                    <Spacer height="16px" />
                                </>
                            );
                        });
                })}
            </InfiniteScroll>
        </VStack>
    );
}

function ResultsForHeading() {
    return (
        <Text as="span" fontSize={{ base: "24px", sm: "30px" }} opacity={0.5}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                R
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                es
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                u
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                l
            </Text>
            <Text as="span" {...fontStyles["expandedBold"]} mr="6px">
                t
            </Text>

            <Text as="span" {...fontStyles["condensedMedium"]}>
                f
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                o
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                r
            </Text>
        </Text>
    );
}

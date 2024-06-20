import { ArticlePreviewCard } from "@app/components/shared/article-preview-card/ArticlePreviewCard";
import { PaginatedArticle, getArticlesPaginated } from "@app/services/articles";
import { fontStyles } from "@app/utils/fonts";
import {
    Divider,
    HStack,
    Heading,
    Spacer,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 2;
const INITIAL_OFFSET = 0;

export const getServerSideProps: GetServerSideProps<{
    articles: PaginatedArticle[];
    likes: Record<string, number>;
    totalCount: number;
    nextOffset: number;
}> = async function (ctx) {
    const query = ctx.query.query as string | null | undefined;
    const res = await getArticlesPaginated(LIMIT, INITIAL_OFFSET, query);

    return {
        props: {
            articles: res.articles ?? [],
            likes: res.likes ?? {},
            totalCount: res.totalCount ?? 0,
            nextOffset: res.nextOffset ?? 0,
        },
    };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home(props: Props) {
    const searchQuery = null;

    const {
        data,
        error,
        isError,
        fetchNextPage,
        hasNextPage,
        status,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["articlesPaginated", searchQuery],
        queryFn: ({ pageParam }) => {
            return getArticlesPaginated(LIMIT, pageParam, searchQuery);
        },
        // initialPageParam: INITIAL_OFFSET + LIMIT, // as we've fetched first page in SSR
        // same as below
        initialPageParam: props.nextOffset,
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
    });

    return (
        <VStack
            as="main"
            my={{ base: "2rem", sm: "4rem" }}
            mt={{ base: "calc(1rem + 70px)", sm: "calc(4rem + 70px)" }}
            w="100%"
            justifyContent="center"
        >
            <VStack
                maxWidth="700px"
                w="100%"
                px="1rem"
                alignItems="start"
                gap="16px"
            >
                <FeedHeading />
                <Divider borderColor="gray.200" />

                <InfiniteScroll
                    dataLength={data.pages.reduce(
                        (a, b) => a + (b.articles?.length ?? 0),
                        0
                    )}
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
                            <Text textAlign="center" color="gray.500">
                                <b>Yay! You have seen it all</b>
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

                                return (
                                    <>
                                        <ArticlePreviewCard
                                            key={article.articleId}
                                            article={article}
                                            likeCount={likeCount}
                                        />

                                        <Spacer height="16px" />
                                    </>
                                );
                            });
                    })}
                </InfiniteScroll>
            </VStack>
        </VStack>
    );
}

function FeedHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "24px", sm: "30px" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                F
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                e
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                e
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                d
            </Text>
        </Heading>
    );
}

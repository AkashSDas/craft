import { ReadingListCard } from "@app/components/reading-lists/ReadingListCard";
import { ArticlePreviewCard } from "@app/components/shared/article-preview-card/ArticlePreviewCard";
import { useUser } from "@app/hooks/auth";
import {
    useGetReadingList,
    useReadingListsManager,
} from "@app/hooks/reading-lists";
import { ReadingListType } from "@app/services/reading-lists";
import { fontStyles } from "@app/utils/fonts";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Button,
    Divider,
    Heading,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserLibraryPage() {
    const [selectedList, setSelectedList] = useState<ReadingListType | null>(
        null
    );
    const { isLoggedIn, status } = useUser();
    const router = useRouter();
    const { readingListsQuery } = useReadingListsManager();
    const { isLoading, isError, data } = readingListsQuery;
    const getReadingListQuery = useGetReadingList(selectedList?._id);

    if (status !== "success") {
        return (
            <VStack>
                <Spinner size="xl" thickness="3px" mt="calc(70px + 4rem)" />
            </VStack>
        );
    } else if (!isLoggedIn) {
        router.push("/auth/login");
        return (
            <VStack>
                <Spinner size="xl" thickness="3px" mt="calc(70px + 4rem)" />
            </VStack>
        );
    }

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
                <LibraryHeading />
                <Divider my="1rem" />

                {!selectedList ? (
                    <VStack justifyContent="center" w="100%" gap="1rem">
                        {isLoading || isError ? (
                            <Spinner size="xl" thickness="3px" mt="4rem" />
                        ) : (
                            data?.readingLists?.map((list) => (
                                <ReadingListCard
                                    key={list._id}
                                    isReadingLater={list.isReadLater}
                                    onClick={() => {
                                        setSelectedList(list);
                                    }}
                                    readingList={list}
                                />
                            ))
                        )}
                    </VStack>
                ) : (
                    <VStack justifyContent="center" w="100%" gap="1rem">
                        <Button
                            w="100%"
                            variant="tab"
                            justifyContent="start"
                            fontSize="24px"
                            fontWeight="bold"
                            leftIcon={<ArrowBackIcon />}
                            onClick={() => setSelectedList(null)}
                        >
                            {selectedList.name}
                        </Button>

                        {getReadingListQuery.isLoading ||
                        getReadingListQuery.isError ? (
                            <Spinner size="xl" thickness="3px" mt="4rem" />
                        ) : getReadingListQuery.readingList?.articleIds
                              .length ? (
                            getReadingListQuery.readingList?.articleIds.map(
                                (articleId) => {
                                    const article =
                                        getReadingListQuery.articles.find(
                                            (article) =>
                                                article.articleId === articleId
                                        );

                                    if (!article) {
                                        return null;
                                    }

                                    const likeCount =
                                        getReadingListQuery.likes[
                                            article._id as string
                                        ] ?? 0;

                                    return (
                                        <ArticlePreviewCard
                                            key={articleId}
                                            article={article}
                                            likeCount={likeCount}
                                        />
                                    );
                                }
                            )
                        ) : (
                            <Text>No articles in this list</Text>
                        )}
                    </VStack>
                )}
            </VStack>
        </VStack>
    );
}

function LibraryHeading() {
    return (
        <Heading as="h1" fontSize={{ base: "48px", sm: "4rem" }}>
            <Text as="span" {...fontStyles["expandedBoldItalic"]}>
                L
            </Text>
            <Text as="span" {...fontStyles["condensedMedium"]}>
                i
            </Text>
            <Text as="span" {...fontStyles["expandedLightItalic"]}>
                s
            </Text>
            <Text as="span" {...fontStyles["bold"]}>
                t
            </Text>
        </Heading>
    );
}

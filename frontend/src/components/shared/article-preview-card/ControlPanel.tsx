import { Article } from "@app/services/articles";
import { HStack, Button, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import { useCommentsManager } from "@app/hooks/comments";
import { useReadingListsManager } from "@app/hooks/reading-lists";
import { useMemo, MouseEvent } from "react";
import { LikeButton } from "@app/components/display-article/LikeButton";

type Props = {
    likeCount: number;
    article: Pick<Article, "articleId">;
    openCommentsDrawer: (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => void;
    openReadingListsDrawer: (
        e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
    ) => void;
};

export function ControlPanel(props: Props) {
    const { likeCount, article } = props;
    const { commentsQuery } = useCommentsManager(article.articleId);
    const { readingListsQuery } = useReadingListsManager();

    const isPartOfReadingList = useMemo(
        function checkIfArticleIsInAnyReadingList() {
            return (
                readingListsQuery.data?.readingLists?.some((list) => {
                    return list.articleIds.includes(article.articleId);
                }) ?? false
            );
        },
        [readingListsQuery.data, article.articleId]
    );

    return (
        <HStack justifyContent="space-between" w="100%">
            <HStack>
                <LikeButton likeCount={likeCount} article={article} />

                <Button
                    h="38px"
                    variant="tab"
                    onClick={props.openCommentsDrawer}
                    leftIcon={
                        <Image
                            src="/icons/chat.png"
                            alt="Comments"
                            width={20}
                            height={20}
                        />
                    }
                >
                    {commentsQuery.data?.comments?.length ?? 0}
                </Button>

                <IconButton
                    h="38px"
                    variant="tab"
                    onClick={props.openReadingListsDrawer}
                    aria-label="Save article"
                >
                    <Image
                        src={
                            isPartOfReadingList
                                ? "/icons/bookmark-solid.png"
                                : "/icons/bookmark.png"
                        }
                        alt="Save"
                        width={20}
                        height={20}
                    />
                </IconButton>
            </HStack>
        </HStack>
    );
}

import { Article } from "@app/services/articles";
import { HStack, Button } from "@chakra-ui/react";
import Image from "next/image";
import { LikeButton } from "./LikeButton";
import { useCommentsManager } from "@app/hooks/comments";

type Props = {
    likeCount: number;
    article: Article;
    openCommentsDrawer: () => void;
};

export function ControlPanel(props: Props) {
    const { likeCount, article } = props;
    const { commentsQuery } = useCommentsManager(article.articleId);

    return (
        <HStack
            justifyContent="space-between"
            mt="1.5rem"
            py="8px"
            w="100%"
            borderY="1px solid"
            borderColor="gray.300"
        >
            <HStack>
                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/play.png"
                        alt="Play audio"
                        width={24}
                        height={24}
                    />
                </Button>

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/open-book.png"
                        alt="Get summary"
                        width={20}
                        height={20}
                    />
                </Button>
            </HStack>

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

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/bookmark.png"
                        alt="Save"
                        width={20}
                        height={20}
                    />
                </Button>

                <Button h="38px" variant="tab">
                    <Image
                        src="/icons/share.png"
                        alt="Share"
                        width={20}
                        height={20}
                    />
                </Button>
            </HStack>
        </HStack>
    );
}

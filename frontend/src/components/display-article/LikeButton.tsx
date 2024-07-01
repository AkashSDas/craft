import { useLikesManager } from "@app/hooks/likes";
import { Article } from "@app/services/articles";
import { Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useUser } from "@app/hooks/auth";

type LikeButtonProps = {
    likeCount: number;
    article: Pick<Article, "articleId">;
};

export function LikeButton(props: LikeButtonProps) {
    const { isLoggedIn } = useUser();
    const router = useRouter();
    const { likeCount, article } = props;
    const { likeOrDislikeArticleMutation, likedArticlesQuery } =
        useLikesManager();
    const [totalLikeCount, setTotalLikeCount] = useState(likeCount);
    const isLiked = useMemo(
        function checkIfLiked() {
            if (!likedArticlesQuery.data) return false;
            return (
                likedArticlesQuery.data.articles?.some(
                    (art) => art.articleId === article.articleId
                ) ?? false
            );
        },
        [likedArticlesQuery.data, article.articleId]
    );

    return (
        <Button
            h="38px"
            variant="tab"
            leftIcon={
                <Image
                    src={isLiked ? "/icons/love-solid.png" : "/icons/love.png"}
                    alt="Like"
                    width={20}
                    height={20}
                />
            }
            onClick={async function handleLike(e) {
                e.preventDefault();
                if (!isLoggedIn) {
                    router.push(`/auth/login?redirectUrl=${encodeURIComponent(router.asPath)}`); // Redirect to login page
                    return;
                }
                if (isLiked) {
                    setTotalLikeCount((prev) => prev - 1);
                } else {
                    setTotalLikeCount((prev) => prev + 1);
                }
                await likeOrDislikeArticleMutation.mutateAsync(article);
            }}
        >
            {totalLikeCount}
        </Button>
    );
}

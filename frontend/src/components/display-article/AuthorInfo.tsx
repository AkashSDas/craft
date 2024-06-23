import { useUser } from "@app/hooks/auth";
import { useFollowerManager } from "@app/hooks/followers";
import { Article } from "@app/services/articles";
import { HStack, VStack, Button, Text, Spinner } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type AuthorInfoProps = {
    author: Article["authorIds"][number];
    lastUpdatedAt: Article["lastUpdatedAt"];
};

export function AuthorInfo({ author, lastUpdatedAt }: AuthorInfoProps) {
    const { user } = useUser();
    const { followAuthorMutation, followersQuery, unfollowAuthorMutation } =
        useFollowerManager();
    const isFollowing = useMemo(
        function checkFollowingStatus() {
            return (
                followersQuery.data?.followers?.some(
                    (follower) => follower.user.userId === author.userId
                ) ?? false
            );
        },
        [author.userId, user?.userId, followersQuery.data?.followers]
    );

    return (
        <HStack justifyContent="space-between" w="100%" mt="1rem">
            <HStack gap="12px">
                <Link href={`/authors/${author.userId}`}>
                    <Image
                        src={author.profilePic?.URL ?? "/mascot.png"}
                        alt={`Author ${author.username}`}
                        height={48}
                        width={48}
                        style={{
                            height: "48px",
                            width: "48px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #d67844",
                        }}
                    />
                </Link>

                <VStack alignItems="start" gap="0px">
                    <Link href={`/authors/${author.userId}`}>
                        <Text fontWeight="600">{author.username}</Text>
                    </Link>

                    <Text fontSize="14px" color="gray">
                        {new Date(lastUpdatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </VStack>
            </HStack>

            <Button
                px="24px"
                onClick={() => {
                    if (isFollowing) {
                        unfollowAuthorMutation.mutateAsync(author);
                    } else {
                        followAuthorMutation.mutateAsync(author);
                    }
                }}
                isLoading={
                    followAuthorMutation.isPending ||
                    unfollowAuthorMutation.isPending
                }
                variant={isFollowing ? "paleSolid" : "solid"}
                disabled={
                    followAuthorMutation.isPending ||
                    unfollowAuthorMutation.isPending
                }
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </HStack>
    );
}

import { useUser } from "@app/hooks/auth";
import { useFollowerManager } from "@app/hooks/followers";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    followersCount: number;
    username: string;
    userId: string;
    profilePicURL?: string | null;
};

export function ProfileHeader(props: Props) {
    const { user } = useUser();
    const { followersCount, username, userId, profilePicURL } = props;

    const { followAuthorMutation, followersQuery, unfollowAuthorMutation } =
        useFollowerManager();
    const isFollowing = useMemo(
        function checkFollowingStatus() {
            return (
                followersQuery.data?.followers?.some(
                    (follower) => follower.user.userId === userId
                ) ?? false
            );
        },
        [userId, user?.userId, followersQuery.data?.followers]
    );

    return (
        <HStack gap={{ base: "16px", sm: "24px" }} w="100%">
            <Box
                pos="relative"
                h={{ base: "60px", sm: "88px" }}
                w={{ base: "60px", sm: "88px" }}
                borderRadius="50%"
                border="3px solid"
                borderColor="brand.700"
                overflow="hidden"
            >
                <Image
                    src={profilePicURL ?? "/mascot.png"}
                    alt="Profic picture"
                    fill
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                />
            </Box>

            <VStack gap="0px" flexGrow={1} alignItems="start">
                <Text
                    fontSize={{ base: "20px", sm: "24px" }}
                    fontWeight="bold"
                    fontStyle="italic"
                >
                    {username}
                </Text>

                <Text
                    fontSize={{ base: "14px", sm: "16px" }}
                    color="gray"
                    fontWeight="medium"
                >
                    {followersCount} followers
                </Text>
            </VStack>

            <Button
                px="24px"
                onClick={() => {
                    const author = {
                        userId,
                        username,
                        profilePic: { URL: profilePicURL },
                    };

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

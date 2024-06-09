import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./auth";
import {
    FollowerUser,
    followAuthor,
    getFollowers,
    getFollowings,
} from "@app/services/followers";
import { useToast } from "@chakra-ui/react";

export function useFollowerManager() {
    const { isLoggedIn, user } = useUser();
    const queryClient = useQueryClient();
    const toast = useToast();

    const followersQuery = useQuery({
        queryKey: ["followers", user?.userId],
        queryFn: getFollowers,
        enabled: isLoggedIn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const followingsQuery = useQuery({
        queryKey: ["followings", user?.userId],
        queryFn: getFollowings,
        enabled: isLoggedIn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const unfollowAuthorMutation = useMutation({
        mutationFn: (author: FollowerUser) => followAuthor(author.userId),
        onMutate(variables) {
            const prev = queryClient.getQueryData(["followers", user?.userId]);
            queryClient.setQueryData(
                ["followers", user?.userId],
                (old: any) => {
                    return {
                        ...old,
                        data: old.data.filter(
                            (follower: FollowerUser) =>
                                follower.userId !== variables.userId
                        ),
                    };
                }
            );

            toast({
                title: "Unfollowed",
                description: `You are no longer following ${variables.username}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            return { previousData: prev };
        },
        onError(_, __, context) {
            if (context) {
                queryClient.setQueryData(
                    ["followers", user?.userId],
                    context.previousData
                );
            }

            toast({
                title: "Error",
                description: "Failed to unfollow author",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries({
                queryKey: ["followers", user?.userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["followings", user?.userId],
            });
        },
    });

    const followAuthorMutation = useMutation({
        mutationFn: (author: FollowerUser) => followAuthor(author.userId),
        onMutate(variables) {
            const prev = queryClient.getQueryData(["followers", user?.userId]);
            queryClient.setQueryData(
                ["followers", user?.userId],
                (old: any) => {
                    return {
                        ...old,
                        data: [...old.data, variables],
                    };
                }
            );

            toast({
                title: "Followed",
                description: `You are now following ${variables.username}`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            return { previousData: prev };
        },
        onError(_, __, context) {
            if (context) {
                queryClient.setQueryData(
                    ["followers", user?.userId],
                    context.previousData
                );
            }

            toast({
                title: "Error",
                description: "Failed to follow author",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries({
                queryKey: ["followers", user?.userId],
            });
            queryClient.invalidateQueries({
                queryKey: ["followings", user?.userId],
            });
        },
    });

    return {
        followersQuery,
        followingsQuery,
        followAuthorMutation,
        unfollowAuthorMutation,
    };
}

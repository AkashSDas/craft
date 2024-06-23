import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./auth";
import {
    FollowerUser,
    followAuthor,
    getFollowers,
    getFollowings,
    unfollowAuthor,
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

    type FollowingsData = (typeof followingsQuery)["data"];

    const unfollowAuthorMutation = useMutation({
        mutationFn: (author: FollowerUser) => unfollowAuthor(author.userId),
        onMutate(variables) {
            const prev = queryClient.getQueryData(["followings", user?.userId]);
            queryClient.setQueryData(
                ["followings", user?.userId],
                (
                    old: FollowingsData | undefined
                ): FollowingsData | undefined => {
                    if (!old) return old;
                    const data = {
                        ...old,
                        followings:
                            old.followings?.filter((f) => {
                                return f.user.userId !== variables.userId;
                            }) ?? [],
                    };

                    return data;
                }
            );

            // toast({
            //     title: "Unfollowed",
            //     description: `You are no longer following ${variables.username}`,
            //     status: "success",
            //     duration: 3000,
            //     isClosable: true,
            // });

            return { previousData: prev };
        },
        onError(error, variables, context) {
            if (context) {
                queryClient.setQueryData(
                    ["followings", user?.userId],
                    context.previousData
                );
            }

            // toast({
            //     title: "Error",
            //     description: "Failed to unfollow author",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            // });
        },
        async onSuccess(data, variables, context) {
            await queryClient.invalidateQueries({
                queryKey: ["followings", user?.userId],
            });
        },
    });

    const followAuthorMutation = useMutation({
        mutationFn: (author: FollowerUser) => followAuthor(author.userId),
        onMutate(variables) {
            const prev = queryClient.getQueryData(["followings", user?.userId]);
            queryClient.setQueryData(
                ["followings", user?.userId],
                (
                    old: FollowingsData | undefined
                ): FollowingsData | undefined => {
                    if (!old) return old;
                    return {
                        ...old,
                        followings: [
                            ...(old.followings ?? []),
                            {
                                _id: "",
                                user: variables,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            },
                        ],
                    };
                }
            );

            // toast({
            //     title: "Followed",
            //     description: `You are now following ${variables.username}`,
            //     status: "success",
            //     duration: 3000,
            //     isClosable: true,
            // });

            return { previousData: prev };
        },
        onError(error, variables, context) {
            if (context) {
                queryClient.setQueryData(
                    ["followings", user?.userId],
                    context.previousData
                );
            }

            // toast({
            //     title: "Error",
            //     description: "Failed to follow author",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: true,
            // });
        },
        async onSuccess(data, variables, context) {
            await queryClient.invalidateQueries({
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

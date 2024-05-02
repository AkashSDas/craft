import { queryClient } from "@app/lib/react-query";
import {
    createOAuthSession,
    getNewAccessToken,
    logout,
    magicLinkLogin,
} from "@app/services/auth";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

/**
 * Get currently logged in user's information and update access token
 */
export function useUser() {
    const { data, status } = useQuery({
        queryKey: ["user"],
        async queryFn() {
            const result = await getNewAccessToken();
            if (!result.accessToken) {
                localStorage.removeItem("accessToken");
                return { user: null };
            } else {
                localStorage.setItem("accessToken", result.accessToken);
                return { user: result.user };
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 4.5 * 60 * 1000, // Refresh every 4.5 (access token expires in 5mins)
        refetchOnReconnect: true,
        staleTime: 4.5 * 60 * 1000, // Invalidate after 5mins
        retryDelay(failureCount, error) {
            if (error.message == "Network Error") {
                return 0;
            }

            return Math.min(2 ** failureCount * 1000, 30 * 1000);
        },
    });

    /**
     * This boolean value tell whether a user has completed the signup process
     * or has partially completed it (incase of OAuth signup)
     */
    const isSignupCompleted = useMemo(
        function checkSignupStatus() {
            console.log({ data });
            return data?.user?.username && data?.user?.email;
        },
        [data?.user]
    );

    return {
        isSignupCompleted,
        isLoggedIn: !!data?.user,
        user: data?.user,
        status,
    };
}

/**
 * After successfully being redirected from Google OAuth signup, create a session which
 * will allow the user to complete the signup process. Allowing user to send authenticated
 * requests to the server
 */
export function useCreateOAuthSession() {
    const router = useRouter();
    const toast = useToast();

    const mutation = useMutation({
        mutationFn: createOAuthSession,
        onSuccess(data, _varaible, _context) {
            if (!data.success) {
                localStorage.removeItem("accessToken");
                toast({
                    title: "Failed to create session",
                    description: data.message,
                    status: "error",
                    isClosable: true,
                });
            } else if (data.success && data.user) {
                localStorage.setItem("accessToken", data.accessToken);
                queryClient.setQueryData(["user"], { user: data.user });

                toast({
                    title: "Session created",
                    status: "success",
                    isClosable: true,
                });

                // Remove token from url
                router.replace(router.pathname, undefined, { shallow: true });
            } else {
                localStorage.removeItem("accessToken");
                toast({
                    title: "Failed to create session",
                    description: "Please try again later",
                    status: "error",
                    isClosable: true,
                });
            }
        },
        onError(error) {
            toast({
                title: "Failed to create session",
                description: error?.message ?? "Please try again later",
                status: "error",
                isClosable: true,
            });
        },
    });

    useEffect(
        function checkForTokenOnInit(): void {
            if (typeof router.query?.token === "string") {
                mutation.mutateAsync(router.query.token);
            }
        },
        [router.query?.token]
    );

    return { isPending: mutation.isPending, isError: mutation.isError };
}

export function useMagicLinkLogin() {
    const router = useRouter();
    const toast = useToast();
    const token = router?.query?.["magic-token"];

    const mutation = useMutation({
        mutationFn: () => {
            if (!token) {
                throw new Error("Magic link token is missing");
            }
            return magicLinkLogin(token as string);
        },
        onSuccess: async (data, _variables, _context) => {
            if (data.success) {
                queryClient.setQueryData(["user"], { user: data.user });
                localStorage.setItem("accessToken", data.accessToken!);

                await router.push("/");
                toast({
                    title: "Success",
                    description: data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
        onError(error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
    });

    useEffect(
        function loginOnInit() {
            if (token) {
                mutation.mutateAsync();
            }
        },
        [token]
    );

    return { isPending: mutation.isPending, isError: mutation.isError };
}

export function useLogout() {
    const toast = useToast();
    const mutation = useMutation({
        mutationFn: logout,
        async onMutate() {
            const prevUser = queryClient.getQueryData(["user"]);
            queryClient.setQueryData(["user"], { user: null });

            toast({
                title: "Logged out",
                description: "You have been logged out",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            return { previousData: prevUser };
        },
        onSuccess(data, variables, context) {
            localStorage.removeItem("accessToken");
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(["user"], context?.previousData);
        },
    });

    const logoutUser = useCallback(async function logoutUser() {
        return mutation.mutateAsync();
    }, []);

    return { logoutUser, isPending: mutation.isPending };
}

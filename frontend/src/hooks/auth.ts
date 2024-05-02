import { queryClient } from "@app/lib/react-query";
import { createOAuthSession, getNewAccessToken } from "@app/services/auth";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
        refetchInterval: 4 * 30 * 1000, // Refresh every 4mins (access token expires in 5mins)
        retryDelay(failureCount, error) {
            if (error.message == "Network Error") {
                return 0;
            }

            return Math.min(2 ** failureCount * 1000, 30 * 1000);
        },
    });

    return {
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
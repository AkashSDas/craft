import { getNewAccessToken } from "@app/services/auth";
import { useQuery } from "@tanstack/react-query";

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

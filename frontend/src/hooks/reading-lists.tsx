import { useQuery } from "@tanstack/react-query";
import { useUser } from "./auth";
import { getReadingLists } from "@app/services/reading-lists";

export function useReadingListsManager() {
    const { isLoggedIn, user } = useUser();

    const readingListsQuery = useQuery({
        queryKey: ["readingLists", user?.userId],
        queryFn: getReadingLists,
        enabled: isLoggedIn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return { readingListsQuery };
}

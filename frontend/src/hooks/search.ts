import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const LOCALSTORAGE_KEY = "recentSearches";
const DEFAULT_LIMIT = 10;

const HistorySchema = z.array(z.string());

export function useRecentSearch() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(function initialSet() {
        parseHistory();
    }, []);

    function parseHistory() {
        const storedHistory = localStorage.getItem(LOCALSTORAGE_KEY);
        if (storedHistory) {
            try {
                const parsedHistory = HistorySchema.safeParse(
                    JSON.parse(storedHistory)
                );

                if (parsedHistory.success) {
                    setHistory(parsedHistory.data);
                    return parsedHistory.data;
                }
            } catch (e) {
                return null;
            }
        }
    }

    function addHistory(searchText: string) {
        const oldHistory = parseHistory();

        if (Array.isArray(oldHistory)) {
            const newHistory = Array.from(
                new Set<string>(
                    [searchText, ...oldHistory].slice(0, DEFAULT_LIMIT)
                )
            );

            setHistory(newHistory);
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newHistory));
        }
    }

    function removeHistory(searchText: string) {
        const newHistory = history.filter((item) => item !== searchText);
        setHistory(newHistory);
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newHistory));
    }

    return { history, addHistory, removeHistory };
}

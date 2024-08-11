import { useLikesManager } from "@app/hooks/likes";
import { userStub } from "@app/mocks/stubs/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
}

describe("Likes Hook", () => {
    describe("useLikesManager", () => {
        // TODO: refactor this test
        it("should fetch liked articles successfully", async () => {
            vi.mock("@app/hooks/auth", () => ({
                useUser: vi.fn().mockImplementation(() => ({
                    user: userStub(),
                    isLoggedIn: true,
                })),
            }));

            const { result } = renderHook(() => useLikesManager(), {
                wrapper: createWrapper(),
            });

            await waitFor(() =>
                expect(result.current.likedArticlesQuery.isSuccess).toBe(true)
            );

            expect(result.current.likedArticlesQuery.isSuccess).toBe(true);
        });
    });
});

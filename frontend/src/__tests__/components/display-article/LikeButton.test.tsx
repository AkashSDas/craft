import { LikeButton } from "@app/components/display-article/LikeButton";
import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { useLikesManager } from "@app/hooks/likes";
import userEvent from "@testing-library/user-event";
import { type ReactElement } from "react";
import { axe } from "jest-axe";

vi.mock("@app/hooks/likes", () => ({
    useLikesManager: vi.fn(),
}));

export const renderComponent = (
    ui: ReactElement,
    options?: Parameters<typeof render>[1]
) => {
    return {
        ...render(ui, options),
        user: userEvent.setup(),
    };
};

describe("LikeButton Component", () => {
    it("should display the initial like count", () => {
        const mockLikeManager = {
            likeOrDislikeArticleMutation: { mutateAsync: vi.fn() },
            likedArticlesQuery: {
                data: { articles: [{ articleId: "123" }] },
            },
        };
        (useLikesManager as Mock).mockReturnValue(mockLikeManager);

        render(<LikeButton likeCount={10} article={{ articleId: "123" }} />);
        const el = screen.getByRole("button");
        expect(el).toHaveTextContent("10");
    });

    it("should decrement the like count", async (): Promise<void> => {
        const user = userEvent.setup();
        const mockLikeManager = {
            likeOrDislikeArticleMutation: { mutateAsync: vi.fn() },
            likedArticlesQuery: {
                data: { articles: [{ articleId: "123" }] },
            },
        };
        (useLikesManager as Mock).mockReturnValue(mockLikeManager);

        render(<LikeButton likeCount={5} article={{ articleId: "123" }} />);

        const el = screen.getByRole("button");
        expect(el).toHaveTextContent("5");
        await user.click(el);
        expect(el).toHaveTextContent("4");
        expect(
            mockLikeManager.likeOrDislikeArticleMutation.mutateAsync
        ).toHaveBeenCalled();
    });

    it("should increment the like count", async (): Promise<void> => {
        const mockLikeManager = {
            likeOrDislikeArticleMutation: { mutateAsync: vi.fn() },
            // Empty liked articles
            likedArticlesQuery: { data: { articles: [] } },
        };
        (useLikesManager as Mock).mockReturnValue(mockLikeManager);

        const { user } = renderComponent(
            <LikeButton likeCount={5} article={{ articleId: "123" }} />
        );

        const el = screen.getByRole("button");
        expect(el).toHaveTextContent("5");
        await user.click(el);
        expect(el).toHaveTextContent("6");
        expect(
            mockLikeManager.likeOrDislikeArticleMutation.mutateAsync
        ).toHaveBeenCalled();
    });

    it("should be accessible", async () => {
        const mockLikeManager = {
            likeOrDislikeArticleMutation: { mutateAsync: vi.fn() },
            likedArticlesQuery: { data: { articles: [] } },
        };
        (useLikesManager as Mock).mockReturnValue(mockLikeManager);

        const { container } = renderComponent(
            <LikeButton likeCount={5} article={{ articleId: "123" }} />
        );

        const results = await axe(container);

        expect(results).toHaveNoViolations();
    });
});

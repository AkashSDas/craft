import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFoundPage from "@app/pages/404";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

describe("NotFoundPage", () => {
    it("should render the NotFoundPage component with the correct text", () => {
        render(<NotFoundPage />);

        const el = screen.getByTestId("not-found-page-text");
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent("Resource not found");
    });
});

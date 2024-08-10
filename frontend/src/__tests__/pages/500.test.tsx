import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InternalServerErrorPage from "@app/pages/500";

describe("InternalServerErrorPage", () => {
    it("should render the InternalServerErrorPage component with the correct text", () => {
        render(<InternalServerErrorPage />);

        const el = screen.getByTestId("internal-server-error-page-text");
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent("Internal Server Error");
    });
});

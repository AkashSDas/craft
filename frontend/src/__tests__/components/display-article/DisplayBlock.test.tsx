import { DisplayBlock } from "@app/components/display-article/DisplayBlock";
import { Block } from "@app/services/articles";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

const blocks: Block[] = [
    {
        blockId: "123",
        type: "paragraph",
        value: {
            text: "Hello World",
        },
    },
    {
        blockId: "456",
        type: "heading",
        value: {
            text: "Hello World",
            variant: "h1",
        },
    },
    {
        blockId: "456",
        type: "heading",
        value: {
            text: "Hello World",
            variant: "h2",
        },
    },
    {
        blockId: "456",
        type: "heading",
        value: {
            text: "Hello World",
            variant: "h3",
        },
    },
    {
        blockId: "456",
        type: "image",
        value: {
            caption: "Hello World",
            URL: "https://example.com/image.png",
            id: "123",
        },
    },
    {
        blockId: "193",
        type: "divider",
        value: {},
    },
    {
        blockId: "12",
        type: "quote",
        value: {
            text: "Hello World",
        },
    },
    {
        blockId: "12",
        type: "not-a-block" as any,
        value: {
            text: "Hello World",
        },
    },
];

describe("DisplayBlock Component", () => {
    it.each(blocks.map((block) => [block, block.type]))(
        "should render $type block based on the payload",
        (block) => {
            const { container } = render(<DisplayBlock block={block} />);
            expect(container).toBeInTheDocument();

            if (block.type === "paragraph") {
                const el = screen.getByTestId("paragraph-block");
                expect(el).toBeInTheDocument();
            } else if (block.type === "heading") {
                const el = screen.getByTestId(
                    `heading-block-${block.value.variant}`
                );
                expect(el).toBeInTheDocument();
            } else if (block.type === "image") {
                const el = screen.getByTestId("image-block");
                expect(el).toBeInTheDocument();
            } else if (block.type === "divider") {
                const el = screen.getByTestId("divider-block");
                expect(el).toBeInTheDocument();
            } else if (block.type === "quote") {
                const el = screen.getByTestId("quote-block");
                expect(el).toBeInTheDocument();
            }
        }
    );
});

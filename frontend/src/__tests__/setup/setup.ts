import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";
import { server } from "@app/mocks/server";

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

vi.mock("next/font/local", () => ({
    default: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
}));

vi.mock("next/font/google", () => ({
    Source_Serif_4: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
    Ubuntu_Mono: () => ({
        style: {
            fontFamily: "mocked",
        },
    }),
}));

expect.extend(toHaveNoViolations);

beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

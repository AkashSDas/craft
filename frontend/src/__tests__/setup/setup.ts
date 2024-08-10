import { vi } from "vitest";

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

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@app": path.resolve(__dirname, "src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: [path.resolve(__dirname, "src/__tests__/setup/setup.ts")],
        include: ["src/__tests__/**/*.test.{ts,tsx,js,jsx}"],
        exclude: ["src/__tests__/e2e/**/*.test.{ts,tsx,js,jsx}"],
        coverage: {
            include: ["src/**/*"],
            exclude: [
                "test/**",
                "src/__tests__/**",
                "vite.*.ts",
                "**/*.d.ts",
                "**/*.test.{ts,tsx,js,jsx}",
                "**/*.config.*",
                "**/snapshot-tests/**",
                "**/*.solution.tsx",
                "**/coverage/**",
            ],
            all: true,
        },
    },
});

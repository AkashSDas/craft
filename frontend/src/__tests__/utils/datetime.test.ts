import { getMonthsInRange } from "@app/utils/datetime";
import { describe, it, expect, vi } from "vitest";

describe("DateTime Utils", () => {
    describe("getMonthsInRange", () => {
        it("should return an array of month-year strings from the start date to the current date", () => {
            // Mock the current date to ensure consistent test results
            const mockDate = new Date("2024-08-01");
            vi.setSystemTime(mockDate);

            const startDateStr = "2024-05-01";
            const result = getMonthsInRange(startDateStr);

            expect(result).toEqual([
                "August 2024",
                "July 2024",
                "June 2024",
                "May 2024",
            ]);

            // Restore the original system time
            vi.useRealTimers();
        });

        it("should return only the start month if the start date is the current month", () => {
            const mockDate = new Date("2024-08-01");
            vi.setSystemTime(mockDate);

            const startDateStr = "2024-08-01";
            const result = getMonthsInRange(startDateStr);

            expect(result).toEqual(["August 2024"]);

            vi.useRealTimers();
        });

        it("should return months in reverse order from current to start date", () => {
            const mockDate = new Date("2024-08-01");
            vi.setSystemTime(mockDate);

            const startDateStr = "2024-01-01";
            const result = getMonthsInRange(startDateStr);

            expect(result).toEqual([
                "August 2024",
                "July 2024",
                "June 2024",
                "May 2024",
                "April 2024",
                "March 2024",
                "February 2024",
                "January 2024",
            ]);

            vi.useRealTimers();
        });

        it("should return an empty array if the start date is in the future", () => {
            const mockDate = new Date("2024-08-01");
            vi.setSystemTime(mockDate);

            const startDateStr = "2024-09-01";
            const result = getMonthsInRange(startDateStr);

            expect(result).toEqual([]);

            vi.useRealTimers();
        });
    });
});

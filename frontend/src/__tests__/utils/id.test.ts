import { createId, generateRandomString } from "@app/utils/ids";
import { describe, it, expect } from "vitest";

describe("ID Utils", () => {
    describe("createId", () => {
        it("should create id with given prefix", () => {
            let id: string;

            id = createId("acc");
            expect(id).toMatch(/acc_[a-zA-Z0-9]/);

            id = createId("art");
            expect(id).toMatch(/art_[a-zA-Z0-9]/);

            id = createId("test");
            expect(id).toMatch(/test_[a-zA-Z0-9]/);
        });
    });

    describe("generateRandomString", () => {
        it("should return string with given length", () => {
            expect(generateRandomString(10)).toHaveLength(10);
            expect(generateRandomString(5)).toHaveLength(5);
        });
    });
});

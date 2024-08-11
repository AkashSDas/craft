import { User } from "@app/types/user";
import { http, HttpResponse } from "msw";
import { userStub } from "../stubs/user";

export const handlers = [
    http.get("/auth/access-token", (ctx) => {
        return HttpResponse.json({
            accessToken: "accessToken",
            user: userStub(),
        });
    }),
];

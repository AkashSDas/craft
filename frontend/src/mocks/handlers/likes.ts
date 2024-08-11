import { http, HttpResponse } from "msw";
import { articleStub } from "../stubs/article";

export const handlers = [
    http.get("/likes", (ctx) => {
        return HttpResponse.json(
            { articles: [articleStub()], message: "Liked articles" },
            { status: 200 }
        );
    }),
    http.post("/likes", async ({ request }) => {
        const { articleId } = (await request.json()) as { articleId: string };
        return HttpResponse.json(
            { message: `Liked article ${articleId}` },
            { status: 200 }
        );
    }),
];

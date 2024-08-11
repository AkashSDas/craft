import { handlers as likeHandlers } from "./likes";
import { handlers as authHandlers } from "./auth";

export const handlers = [...authHandlers, ...likeHandlers];

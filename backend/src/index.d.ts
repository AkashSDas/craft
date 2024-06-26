import { Request } from "express";
import { User } from "./users/schema";

export interface IRequest extends Request {
    user: User;
}

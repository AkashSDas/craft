import { Controller } from "@nestjs/common";
import { CommentService } from "./comments.service";

@Controller("comments")
export class CommentController {
    constructor(private serv: CommentService) {}
}

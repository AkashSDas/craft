import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comments.repository";

@Injectable()
export class CommentService {
    constructor(private repo: CommentRepository) {}
}

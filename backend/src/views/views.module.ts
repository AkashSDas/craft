import { Module } from "@nestjs/common";
import { ViewsController } from "./views.controller";
import { ViewsRepsitory } from "./views.repository";
import { ViewsService } from "./views.service";
import { ArticleService } from "src/articles/article.service";

@Module({
    controllers: [ViewsController],
    providers: [ViewsRepsitory, ViewsService],
    imports: [ArticleService],
})
export class ViewsModule {}

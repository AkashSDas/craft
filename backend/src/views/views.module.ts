import { Module } from "@nestjs/common";
import { ViewsController } from "./views.controller";
import { ViewsRepository } from "./views.repository";
import { ViewsService } from "./views.service";
import { ArticleModule } from "src/articles/article.module";
import { MongooseModule } from "@nestjs/mongoose";
import { View, ViewSchema } from "./schema";

@Module({
    controllers: [ViewsController],
    providers: [ViewsRepository, ViewsService],
    imports: [
        MongooseModule.forFeature([{ name: View.name, schema: ViewSchema }]),
        ArticleModule,
    ],
})
export class ViewsModule {}

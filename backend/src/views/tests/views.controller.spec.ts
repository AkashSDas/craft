import { Test } from "@nestjs/testing";
import { ViewsController } from "../views.controller";
import { ViewsService } from "../views.service";
import { AddViewDto } from "../dto";
import { createId } from "src/utils/ids";
import { IRequest } from "src";
import { Response } from "express";

jest.mock("../views.service");

describe("ViewController", () => {
    let ctrl: ViewsController;
    let serv: ViewsService;
    let reqWithUserMock = {} as unknown as IRequest;
    let resMock = {} as unknown as Response;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ViewsController],
            providers: [ViewsService],
        }).compile();

        ctrl = moduleRef.get<ViewsController>(ViewsController);
        serv = moduleRef.get<ViewsService>(ViewsService);
        jest.clearAllMocks();
    });

    it("should have ViewController and ViewsService defined", () => {
        expect(ctrl).toBeDefined();
        expect(serv).toBeDefined();
    });

    // ====================================
    // Unit tests
    // ====================================

    describe("addViewForArticle", () => {
        const getPayload = (): AddViewDto => {
            return {
                articleId: createId("art"),
            };
        };

        it("should create a view and return 204 status", async () => {
            const res = await ctrl.addViewForArticle(
                reqWithUserMock,
                getPayload(),
                resMock,
            );
        });
    });
});

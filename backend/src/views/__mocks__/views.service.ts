import * as stubs from "../tests/stubs/views.stub";

export const ViewsService = jest.fn().mockReturnValue({
    addViewForArticle: jest.fn().mockReturnValue(stubs.viewDocumentStub()),
    updateReadTimeForArticle: jest.fn().mockResolvedValue(undefined),
    getUserArticlesMonthlyViewsAggregated: jest
        .fn()
        .mockResolvedValue([
            stubs.montlyViewStub(),
            stubs.montlyViewStub(),
            stubs.montlyViewStub(),
        ]),
    getUserArticlesLifetimeViewsAggregated: jest
        .fn()
        .mockResolvedValue([
            stubs.lifetimeViewStub(),
            stubs.lifetimeViewStub(),
        ]),
});

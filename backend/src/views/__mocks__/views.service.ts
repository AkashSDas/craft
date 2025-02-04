import * as stubs from "../tests/stubs/views.stub";

export const ViewsService = jest.fn().mockReturnValue({
    addViewForArticle: jest.fn().mockReturnValue(stubs.viewDocumentStub()),
    updateReadTimeForArticle: jest.fn().mockResolvedValue(undefined),
    getUserArticlesMonthlyViewsAggregated: jest
        .fn()
        .mockResolvedValue([
            stubs.monthlyViewStub(),
            stubs.monthlyViewStub(),
            stubs.monthlyViewStub(),
        ]),
    getUserArticlesLifetimeViewsAggregated: jest
        .fn()
        .mockResolvedValue([
            stubs.lifetimeViewStub(),
            stubs.lifetimeViewStub(),
        ]),
});

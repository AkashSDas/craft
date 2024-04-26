import { accessTokenStub, refreshTokenStub } from "../test/stubs/tokens";
import { userStub } from "../test/stubs/user.stub";

export const AuthService = jest.fn().mockReturnValue({
    emailSignup: jest.fn().mockResolvedValue({
        user: userStub(),
        accessToken: accessTokenStub(),
        refreshToken: refreshTokenStub(),
    }),
    initMagicLinkLogin: jest.fn().mockResolvedValue(undefined),
    completeMagicLinkLogin: jest.fn().mockResolvedValue({
        user: userStub(),
        accessToken: accessTokenStub(),
        refreshToken: refreshTokenStub(),
    }),
    getNewAccessToken: jest.fn().mockResolvedValue({
        user: userStub(),
        accessToken: accessTokenStub(),
    }),
});

import { TestingModule, Test } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { userStub } from "./stubs/user.stub";
import { EmailSignupDto } from "../dto";
import { Response } from "express";
import { accessTokenStub } from "./stubs/tokens";
import { ConfigModule } from "@nestjs/config";

jest.mock("../auth.service");

describe("AuthController", () => {
    let controller: AuthController;
    let service: AuthService;
    let res: Response;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true })],
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        controller = moduleRef.get<AuthController>(AuthController);
        service = moduleRef.get<AuthService>(AuthService);
        res = {
            json: jest.fn(),
            cookie: jest.fn(),
        } as any;
        jest.clearAllMocks();
    });

    describe("emailSignup", () => {
        let user: NonNullable<ReturnType<typeof userStub>>;
        let payload: EmailSignupDto;
        let accessToken: string;

        beforeEach(() => {
            user = userStub();
            payload = {
                email: user.email,
                username: user.username,
            };
            accessToken = accessTokenStub();
        });

        it("should return user and access token", async () => {
            const result = await controller.emailSignup(payload, res);
            expect(result).toEqual({ user, accessToken: accessToken });
        });

        it("should call emailSignup service", async () => {
            await controller.emailSignup(payload, res);
            expect(service.emailSignup).toHaveBeenCalledWith(payload);
        });

        it("should set refresh token cookie", async () => {
            await controller.emailSignup(payload, res);
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                expect.any(String),
                {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: expect.any(Number),
                },
            );
        });
    });
});

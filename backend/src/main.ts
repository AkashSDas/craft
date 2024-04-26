import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as fileUpload from "express-fileupload";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");
    app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });

    // Enable validation and strip out any properties that are not in the DTO
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    app.use(morgan("dev"));
    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.COOKIE_SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_EXPIRES_IN_MS),
            },
        }),
    );
    app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

    await app.listen(process.env.PORT ?? 8000);
}

bootstrap();

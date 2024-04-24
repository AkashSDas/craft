import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ImageSchema, type IImage } from "./image.schema";
import {
    OauthProviderSchema,
    type OAuthProvider,
} from "./oauth-provider.schema";
import { createId } from "src/utils/ids";
import { isEmail } from "class-validator";
import { dateInFuture } from "src/utils/datetime";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import { randomBytes, createHash } from "crypto";

interface IUser {
    /** Public facing user document id */
    userId: string;

    /**
     * Username is required but for Google OAuth we first create user and then
     * we get the username from the user. Therefore username is optional
     */
    username?: string;

    email: string;
    profilePic: IImage;

    /** Login token for email magic link */
    magicLinkToken?: string;
    magicLinkTokenExpiresAt?: Date;

    /**
     * Before the redirect from OAuth signup, set this token. This will be used
     * to identify the user and during creation of OAuth session where we will
     * send access and refresh tokens
     */
    oauthSignupSessionToken?: string;

    /** List of OAuth providers used with their respective sid */
    oAuthProviders: OAuthProvider[];
}

@Schema({ timestamps: true })
export class User extends Document implements IUser {
    constructor() {
        super();
    }

    @Prop({
        type: String,
        required: true,
        unique: true,
        default: () => createId("acc"),
        immutable: true,
    })
    userId: string;

    @Prop({ type: String, minlength: 3, maxlength: 256, trim: true })
    username?: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "Invalid email"],
    })
    email: string;

    @Prop({ type: ImageSchema, required: true })
    profilePic: IImage;

    @Prop({ type: String, select: false })
    magicLinkToken?: string;

    @Prop({
        type: Date,
        select: false,
        validate: [
            { validator: dateInFuture, message: "{VALUE} is invalid date" },
        ],
    })
    magicLinkTokenExpiresAt?: Date;

    @Prop({ type: String, select: false })
    oauthSignupSessionToken?: string;

    @Prop({ type: [OauthProviderSchema], default: [], required: true })
    oAuthProviders: OAuthProvider[];

    createAccessToken!: (jwt: JwtService) => string;
    createRefreshToken!: (jwt: JwtService) => string;
    createMagicLinkToken!: () => string;
    unhashMagicLinkToken!: (token: string) => boolean;

    _id!: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ====================================
// Attaching methods to user schema
// ====================================

UserSchema.methods.createAccessToken = function (jwt: JwtService): string {
    const payload = { email: this.email };
    return jwt.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
};

UserSchema.methods.createRefreshToken = function (jwt: JwtService): string {
    const payload = { _id: this._id, email: this.email };
    return jwt.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
};

UserSchema.methods.createMagicLinkToken = function (): string {
    const token = randomBytes(32).toString("hex");
    this.magicLinkToken = createHash("sha256").update(token).digest("hex");
    this.magicLinkTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10m
    return token;
};

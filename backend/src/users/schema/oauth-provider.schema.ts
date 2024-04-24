import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export const AuthProvider = {
    GOOGLE: "google",
} as const;

interface IOAuthProvider {
    sid: string;
    provider: (typeof AuthProvider)[keyof typeof AuthProvider];
}

@Schema({ _id: false })
export class OAuthProvider implements IOAuthProvider {
    @Prop({ type: String, required: true })
    sid: string;

    @Prop({ type: String, required: true, enum: Object.values(AuthProvider) })
    provider: (typeof AuthProvider)[keyof typeof AuthProvider];
}

export const OauthProviderSchema = SchemaFactory.createForClass(OAuthProvider);

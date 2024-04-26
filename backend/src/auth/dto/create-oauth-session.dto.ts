import { IsNotEmpty, IsString } from "class-validator";

export class CreateOAuthSessionDto {
    /**
     * OAuth token created while signing up a user with OAuth provider
     * (`user.oauthSignupSessionToken`)
     */
    @IsString()
    @IsNotEmpty()
    token: string;
}

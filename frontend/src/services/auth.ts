import { EmailSignupInputs } from "@app/components/auth/email-signup-form";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { type User } from "@app/types/user";

export async function emailSignup(payload: EmailSignupInputs) {
    type SuccessResponse = { user: User; accessToken: string };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.emailSignup,
        { method: "POST", data: payload }
    );
    const { data, status } = response;

    if (status === 201 && data !== null && "user" in data) {
        return {
            success: true,
            message: "Account created successfully",
            user: data.user,
            accessToken: data.accessToken,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: response.error?.message ?? "Unknown error",
    };
}

export async function getNewAccessToken() {
    type SuccessResponse = { user: User; accessToken: string };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.newAccessToken,
        { method: "GET" }
    );
    const { data, status } = response;

    if (status === 200 && data !== null && "user" in data) {
        return {
            success: true,
            message: "Successfully refreshed access token",
            user: data.user,
            accessToken: data.accessToken,
        };
    } else if (status === 404 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: response.error?.message ?? "Unknown error",
    };
}

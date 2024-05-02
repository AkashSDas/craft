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

/**
 * Get a new access token for the currently logged in user
 */
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

/**
 * @param token OAuth token received after successfully creation Google auth session
 */
export async function createOAuthSession(token: string) {
    type SuccessResponse = { user: User; accessToken: string };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.createOAuthSession,
        { method: "POST", data: { token } }
    );
    const { data, status } = response;

    if (status === 200 && data !== null && "user" in data) {
        return {
            success: true,
            message: "Successfully created session",
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

/**
 * Complete the oauth signup process. After creating a session with Google, user has
 * to fill in the missing details like username and submit to complete the signup process
 */
export async function completeOAuthSignup(payload: {
    email: string;
    username: string;
}) {
    type SuccessResponse = { user: User; accessToken: string };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.completeOAuthSignup,
        { method: "PUT", data: payload }
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

/**
 * This service will abort the signup process if the user decides to cancel it
 * and delete the user's partial account created during the signup process
 */
export async function cancelOAuthSignup() {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    var response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.completeOAuthSignup,
        { method: "DELETE" }
    );

    if (response.status === 200) {
        return {
            success: true,
            message: "Successfully cancelled signup",
        };
    }

    return {
        success: false,
        message: response.error?.message ?? "Unknown error",
    };
}

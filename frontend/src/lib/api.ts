import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    timeout: 3000, // 3 seconds
    timeoutErrorMessage: "Request timed out",
});

type ApiResponse<T> = {
    status: number;
    data: T | null;
    error: null | any;
    success: boolean;
};

export async function fetchFromAPI<T>(
    url: string,
    opts?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
    try {
        const response = await axiosInstance<T>(url, opts);

        return {
            status: response.status,
            data: response.data,
            error: null,
            success: response.status < 300,
        };
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response) {
                return {
                    status: e.response.status,
                    data: e.response.data,
                    error: null,
                    success: e.response.status < 300,
                };
            }

            if (e.message === "Network Error") {
                return {
                    status: 500,
                    data: null,
                    error: { message: "Network Error" },
                    success: false,
                };
            }
        }

        console.error(e);
    }

    return {
        status: 500,
        data: null,
        error: { message: "Unknown Error" },
        success: false,
    };
}

export const endpoints = Object.freeze({
    emailSignup: "auth/email-signup",
    newAccessToken: "auth/access-token",
    logout: "auth/logout",
    createOAuthSession: "auth/oauth-session",
    cancelOAuthSession: "auth/oauth-session",
    completeOAuthSignup: "auth/oauth-session",
    emailLogin: "auth/email-login",
    completeEmailLogin: "auth/email-login",
});
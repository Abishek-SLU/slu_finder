
import { apiRequest } from "./api";

export type RegisterData = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
};

export type LoginResult = {
    jwt: string;
    userName: string;
    fullName: string;
    roleName: string;
    message: string;
};

export function sendOtp(email: string) {
    return apiRequest<{ message: string; email: string }>(
        "/api/register/generate-otp",
        "POST",
        { email }
    );
}

export function verifyOtp(email: string, otp: string) {
    return apiRequest(
        "/api/register/verify-otp",
        "POST",
        { email, otp }
    );
}

export function registerUser(data: RegisterData) {
    return apiRequest(
        "/api/register/create",
        "POST",
        data
    );
}

export function loginUser(userName: string, password: string) {
    return apiRequest<LoginResult>(
        "/auth/login",
        "POST",
        { userName, password }
    );
}

export function getUserDetails(token: string) {
    return apiRequest(
        "/auth/user-details",
        "GET",
        undefined,
        token
    );
}

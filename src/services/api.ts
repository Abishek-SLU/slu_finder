import { clearToken, isTokenValid } from "./authSession";

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export async function apiRequest<T>(
    endpoint: string,
    method: string = "GET",
    body?: object,
    token?: string
): Promise<T> {
    if (token !== undefined && !isTokenValid(token)) {
        await clearToken(token);
        throw new Error("Your session has expired. Please log in again.");
    }
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new Error(
            "Cannot connect to Spring Boot. Check the API URL and backend."
        );
    }

    if (response.status === 401 && token) {
        await clearToken(token);
        throw new Error("Your session has expired. Please log in again.");
    }
    const rawText = await response.text();

    let result: any = {};

    if (rawText) {
        try {
            result = JSON.parse(rawText);
        } catch {
            throw new Error("Invalid response received from backend");
        }
    }

    if (!response.ok || result.error) {
        throw new Error(
            result.error?.reason ||
            result.error?.message ||
            result.message ||
            `Request failed (${response.status})`
        );
    }

    return (result.data ?? result.response ?? result) as T;
}

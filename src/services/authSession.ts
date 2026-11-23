import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const TOKEN_KEY = "slu_finder_access_token";
let currentToken: string | null | undefined;
let revision = 0;
const listeners = new Set<() => void>();

// This only checks JWT structure/time claims. Spring Boot verifies the signature.
export function tokenExpiresAt(token: string): number | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3 || parts.some(part => !/^[A-Za-z0-9_-]+$/.test(part))) return null;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")));
        if (typeof claims.exp !== "number" || !Number.isFinite(claims.exp)) return null;
        if (claims.nbf !== undefined && (typeof claims.nbf !== "number" || claims.nbf * 1000 > Date.now())) return null;
        return claims.exp * 1000;
    } catch {
        return null;
    }
}

export function isTokenValid(token: string | null | undefined): token is string {
    const expires = token ? tokenExpiresAt(token) : null;
    return expires !== null && expires > Date.now();
}

export function subscribeSession(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

function publish(token: string | null) {
    currentToken = token;
    revision++;
    listeners.forEach(listener => listener());
}

export async function saveToken(token: string) {
    if (!isTokenValid(token)) throw new Error("The login token is invalid or expired. Please log in again.");
    if (Platform.OS === "web") {
        // A failed write must not report a successful persistent login.
        window.localStorage.setItem(TOKEN_KEY, token);
    } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    publish(token);
}

export async function getToken(): Promise<string | null> {
    if (currentToken === undefined) {
        const started = revision;
        let stored: string | null = null;
        try {
            stored = Platform.OS === "web"
                ? (typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY))
                : await SecureStore.getItemAsync(TOKEN_KEY);
        } catch {
            // Storage unavailable: remain signed out.
        }
        if (started === revision) currentToken = stored;
    }
    if (currentToken && !isTokenValid(currentToken)) await clearToken();
    return currentToken ?? null;
}

export async function clearToken(expectedToken?: string) {
    // A late 401 from an old request must not log out a newer session.
    if (expectedToken && currentToken !== expectedToken) return;
    publish(null);
    try {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    } catch {
        // Keep the current app session signed out even if storage is unavailable.
    }
}

export async function reloadSession() {
    revision++;
    currentToken = undefined;
    await getToken();
    listeners.forEach(listener => listener());
}

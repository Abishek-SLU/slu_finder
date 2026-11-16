
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "slu_finder_access_token";

let webToken: string | null = null;

export async function saveToken(token: string) {
    if (Platform.OS === "web") {
        webToken = token;
        return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
        return webToken;
    }

    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
    if (Platform.OS === "web") {
        webToken = null;
        return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

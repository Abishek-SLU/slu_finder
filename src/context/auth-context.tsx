import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { getToken, reloadSession, subscribeSession, TOKEN_KEY, tokenExpiresAt } from "@/services/authSession";

const AuthContext = createContext<{ token: string | null; loading: boolean }>({ token: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<{ token: string | null; loading: boolean }>({ token: null, loading: true });
    useEffect(() => {
        let active = true;
        let generation = 0;
        let timer: ReturnType<typeof setTimeout>;
        async function update() {
            const request = ++generation;
            const token = await getToken();
            if (!active || request !== generation) return;
            clearTimeout(timer);
            setSession({ token, loading: false });
            if (token) {
                timer = setTimeout(() => { void update(); }, Math.min(Math.max(1, tokenExpiresAt(token)! - Date.now()), 2147483647));
            }
        }
        const unsubscribe = subscribeSession(() => { void update(); });
        const appState = AppState.addEventListener("change", state => {
            if (state === "active") void update();
        });
        const storage = (event: StorageEvent) => {
            if (event.key === TOKEN_KEY || event.key === null) void reloadSession();
        };
        const focus = () => { void update(); };
        if (Platform.OS === "web") {
            window.addEventListener("storage", storage);
            window.addEventListener("focus", focus);
        }
        void update();
        return () => {
            active = false;
            clearTimeout(timer);
            unsubscribe();
            appState.remove();
            if (Platform.OS === "web") {
                window.removeEventListener("storage", storage);
                window.removeEventListener("focus", focus);
            }
        };
    }, []);
    return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

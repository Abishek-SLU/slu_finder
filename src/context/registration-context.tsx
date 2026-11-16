import { createContext, ReactNode, useContext, useState } from "react";

import type { RegisterData } from "@/services/authService";

type RegistrationContextType = {
  pendingRegistration: RegisterData | null;
  setPendingRegistration: (data: RegisterData | null) => void;
  clearRegistration: () => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined,
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [pendingRegistration, setPendingRegistration] =
    useState<RegisterData | null>(null);

  function clearRegistration() {
    setPendingRegistration(null);
  }

  return (
    <RegistrationContext.Provider
      value={{
        pendingRegistration,
        setPendingRegistration,
        clearRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error("useRegistration must be used inside RegistrationProvider");
  }

  return context;
}

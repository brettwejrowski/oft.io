import { createContext, useContext, useState } from "react";
import AuthDialog from "../components/AuthDialog";

interface AuthContextValue {
  openAuthDialog: () => void;
}

const AuthContext = createContext<AuthContextValue>({ openAuthDialog: () => {} });

export function useAuthDialog() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ openAuthDialog: () => setOpen(true) }}>
      {children}
      {open && <AuthDialog onClose={() => setOpen(false)} />}
    </AuthContext.Provider>
  );
}

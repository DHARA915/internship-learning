
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type User = { name: string; email: string };
type LoginResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: User | null;
  ready: boolean; 
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
};

// Hard-coded accounts:
const USERS = [
  { email: "dhara.patel912005@gmail.com", password: "123456", name: "Admin" },
  // { email: "user@example.com", password: "user123", name: "Demo User" },
];

const STORAGE_KEY = "auth-user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch (error) {
     console.error(error)
    }
    setReady(true);
  }, []);

  function login(email: string, password: string): LoginResult {
    const match = USERS.find(
      (user) => user.email === email.trim().toLowerCase() && user.password === password
    );
    if (!match) return { ok: false, error: "Invalid email or password." };

    // Never store the password, only who is logged in.
    const next = { name: match.name, email: match.email };
    setUser(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
    console.error(error)
    }
    return { ok: true };
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error){
    console.error(error) 
    }
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}


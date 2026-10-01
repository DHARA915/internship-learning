import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
}

interface AuthState {
  currentUser: User | null;
}

const STORAGE_KEY = "userEmail";

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

console.log("loadUser",loadUser)

const initialState: AuthState = {
  currentUser: loadUser(), // restored on refresh
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCurrentUser, logout } = authSlice.actions;
export default authSlice.reducer;
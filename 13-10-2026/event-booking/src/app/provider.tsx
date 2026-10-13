"use client";

import { Provider } from "react-redux";
import { store } from "@/Redux/store"; // adjust to wherever your store is exported

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
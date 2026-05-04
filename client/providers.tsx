"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { NotificationProvider } from "@/components/ui/BrowserNotification";
import { makeStore, type AppStore } from "./store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Store chỉ được tạo một lần trên browser để cache RTK Query không bị reset.
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <Provider store={store}>
      <NotificationProvider>{children}</NotificationProvider>
    </Provider>
  );
}

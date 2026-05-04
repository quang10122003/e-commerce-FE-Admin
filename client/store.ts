import { configureStore } from "@reduxjs/toolkit";
import { backendApi } from "./api/backend-api";

export function makeStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(backendApi.middleware),
    reducer: {
      [backendApi.reducerPath]: backendApi.reducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

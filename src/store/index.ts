import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  PERSIST,
  REHYDRATE,
} from "redux-persist";
import remoteReduxEnhancer from "@redux-devtools/remote";
import rootReducer from "./reducers";
import { disk } from "./storage";
import { persistVersion, persistMigrate } from "./migrations";

const enhancers = [];

if (process.env.REDUX_DEVTOOLS_ENABLED === "true") {
  enhancers.push(
    remoteReduxEnhancer({
      realtime: true,
      hostname: "localhost",
      port: 5010,
    })
  );
}

const persistedReducer = persistReducer(
  {
    key: "root",
    storage: disk,
    version: persistVersion,
    migrate: persistMigrate,
  },
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  enhancers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REHYDRATE],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type ReduxState = ReturnType<typeof store.getState>;
export type RootReducerState = ReturnType<typeof rootReducer>;

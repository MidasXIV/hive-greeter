import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import remoteReduxEnhancer from "@redux-devtools/remote";
import rootReducer from "./reducers";
import { disk } from './storage'

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

const persistedReducer = persistReducer({
  key: 'root',
  storage: disk,
}, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  enhancers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store)

export default store;

export type ReduxState = ReturnType<typeof store.getState>;

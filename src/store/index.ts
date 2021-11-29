import { configureStore, Dispatch } from "@reduxjs/toolkit";
import remoteReduxEnhancer from "@redux-devtools/remote";

import fs from 'fs'
import rootReducer from "../store/reducers";
const enhancers = [];

export const DB_FILE = "./db.redux.json";

const preloadedState = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE).toString('utf-8')) : undefined

if (process.env.REDUX_DEVTOOLS_ENABLED === 'true') {
  enhancers.push(remoteReduxEnhancer({
    realtime: true,
    hostname: 'localhost',
    port: 5010,
  }));
}
const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  enhancers,
  preloadedState,
});

export default store;

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { Dispatch };

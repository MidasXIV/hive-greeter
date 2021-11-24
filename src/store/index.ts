import { configureStore, Dispatch } from "@reduxjs/toolkit";
import remoteReduxEnhancer from "@redux-devtools/remote";

import rootReducer from "../store/reducers";
const enhancers = [];

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
});
console.log("store", new Date());

export default store;

export type ReduxState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type { Dispatch };

// export const useDispatch = () => useReduxDispatch<typeof store.dispatch>()
// export const useSelector: TypedUseSelectorHook<ReduxState> = (fn) =>
//   useReduxSelector(fn, shallowEqual)

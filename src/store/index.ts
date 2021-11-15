import { configureStore, Dispatch } from '@reduxjs/toolkit'
import reduxDevTools from '@redux-devtools/cli'
import remoteDevTools from '@redux-devtools/remote'

import rootReducer from './reducers'

const devToolsOptions = { suppressConnectErrors: false, realtime: true, hostname: 'localhost', port: 8000 }

reduxDevTools(devToolsOptions)

const store = configureStore({
  reducer: rootReducer,
  enhancers: [remoteDevTools(devToolsOptions)]
})
export default store

export type ReduxState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type { Dispatch }


// export const useDispatch = () => useReduxDispatch<typeof store.dispatch>()
// export const useSelector: TypedUseSelectorHook<ReduxState> = (fn) =>
//   useReduxSelector(fn, shallowEqual)

   
import { combineReducers } from '@reduxjs/toolkit'

import characters from './slices/characters'
import monsters from './slices/monsters'

const rootReducer = combineReducers({
  characters,
  monsters,
})

export default rootReducer
import { RootReducerState } from ".";
import { createMigrate } from 'redux-persist';

/*
 * This is the current version and should match the latest version
 */
export const persistVersion = 2

/**
 * Here we use RootReducerState instead of ReduxState to avoid cyclical type references
 */
type PersistedReduxStateV2 = RootReducerState

// State prior to roaming monsters
type PersistedReduxStateV1 = Omit<PersistedReduxStateV2, 'characters'> & {
  characters: Omit<PersistedReduxStateV2['characters'], 'roamingMonsters'>
}

type MigrationState = PersistedReduxStateV1 | PersistedReduxStateV2

/** Migrations **/

const persistMigrations = {
	2: (state: PersistedReduxStateV1): PersistedReduxStateV2 => ({
    ...state,
    characters: {
      ...state.characters,
      roamingMonsters: [],
    }
  })
};

export const persistMigrate = createMigrate<MigrationState>(persistMigrations)
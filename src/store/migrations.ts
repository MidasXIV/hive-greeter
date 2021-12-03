import { isObject, prop } from "remeda";
import { ReduxState } from ".";

export const migrations: { [version: number]: (state: unknown) => unknown } = {
  0: (state) => {
    state.characters.roamingMonsters = [];
    return state;
  },
};

import store from '../store'
import { getAllEncounters } from "../store/selectors";

export function getEncounters() {
  return getAllEncounters(store.getState())
}

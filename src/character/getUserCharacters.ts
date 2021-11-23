import store from '../store'
import { getAllCharacters } from "../store/selectors";

export const getUserCharacters = () => getAllCharacters(store.getState())

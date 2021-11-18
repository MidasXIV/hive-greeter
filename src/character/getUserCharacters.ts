import store from '@adventure-bot/store'
import { getAllCharacters } from "@adventure-bot/store/selectors";

export const getUserCharacters = () => getAllCharacters(store.getState())

// cspell: ignore zustand
import create from 'zustand'
import { store } from './vanilla'
// import { State as _State} from './vanilla'

export type {State, Account} from './vanilla'
export const useStore = create(store)

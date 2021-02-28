// cspell: ignore pubkey lamports
import create from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import pipe from 'ramda/src/pipe'
import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js'
// @ts-ignore
import Wallet from '@project-serum/sol-wallet-adapter'

const transport = new HTTPTransport('http://0.0.0.0:8899')
const client = new Client(new RequestManager([transport]))

export interface Account {
  pubkey: string
  account: {
    data: any
    executable: boolean
    lamports: number
    owner: string
    rentEpoch: number
  }
}

export type State = {
  accounts: Account[]
  setAccounts: (accounts: Account[]) => void
  wallet?: any
  setWallet: (wallet: any) => void
  connected: boolean
  setConnected: (connected: boolean) => void
  client: Client
}

let createFunc
if (process.env.NODE_ENV !== 'production') {
  createFunc = pipe(devtools, create)
} else {
  createFunc = create
}

export const store = createFunc<State>((set) => ({
  accounts: [],
  setAccounts: (accounts: Account[]) =>
    set((state) => ({ ...state, accounts })),
  wallet: new Wallet('https://www.sollet.io'),
  setWallet: (wallet: any) => set((state) => ({ ...state, wallet })),
  connected: true, //false,
  setConnected: (connected: boolean) =>
    set((state) => ({ ...state, connected })),
  client: client
}))

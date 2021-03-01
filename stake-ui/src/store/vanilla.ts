// cspell: ignore pubkey lamports
import create from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import pipe from 'ramda/src/pipe'
import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js'
// @ts-ignore
import Wallet from '@project-serum/sol-wallet-adapter'
import { Chain } from '../utils'
const transport = new HTTPTransport('http://devnet.solana.com')
// const transport = new HTTPTransport('http://0.0.0.0:8899')
// const transport = new HTTPTransport('/chain')
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

type DialogName = 'createEgg' | 'redeemEgg'

export type State = {
  chain: Chain
  accounts: Account[]
  setAccounts: (accounts: Account[]) => void
  wallet?: any
  setWallet: (wallet: any) => void
  connected: boolean
  setConnected: (connected: boolean) => void
  client: Client
  setDialogVisible: (name: DialogName, visible: boolean) => void
  dialogs: {
    createEgg: boolean
    redeemEgg: boolean
  }
  selectedEggPublicKey?: string
  setSelectedEggPublicKey: (selectedEggPublicKey: string | undefined) => void
  initialized: boolean
  setInitialized: () => void
}

let createFunc
if (process.env.NODE_ENV !== 'production') {
  createFunc = pipe(devtools, create)
} else {
  createFunc = create
}

export const store = createFunc<State>((set) => ({
  chain: new Chain(),
  accounts: [],
  setAccounts: (accounts: Account[]) =>
    set((state) => ({ ...state, accounts })),
  wallet: new Wallet('https://www.sollet.io'),
  setWallet: (wallet: any) => set((state) => ({ ...state, wallet })),
  connected: true, //false,
  setConnected: (connected: boolean) =>
    set((state) => ({ ...state, connected })),
  client: client,
  setDialogVisible: (name: DialogName, visible: boolean) =>
    set((state) => {
      const dialogs = { ...state.dialogs }
      dialogs[name] = visible
      return { ...state, dialogs }
    }),
  dialogs: {
    createEgg: false,
    redeemEgg: false
  },
  selectedEggPublicKey: undefined,
  setSelectedEggPublicKey: (selectedEggPublicKey: string | undefined) =>
    set((state) => ({ ...state, selectedEggPublicKey })),
  initialized: false,
  setInitialized: () => set((state) => ({ ...state, initialized: true }))
}))

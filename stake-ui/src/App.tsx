// cspell: ignore lamports pubkey blockhash txid
import React, { useEffect, useCallback } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
// @ts-ignore
// import Wallet from '@project-serum/sol-wallet-adapter'
// import { RequestManager, HTTPTransport, Client } from '@open-rpc/client-js'
import { Navbar } from './components/Navbar'
import { EggsCard } from './components/EggsCard'
import { CreateEggCard } from './components/CreateEggCard'
import { DailyRewardsCard } from './components/DailyRewardsCard'
import { MarketCard } from './components/MarketCard'
import { useStore, State, Account } from './store/app'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

// const provider = 'https://www.sollet.io'
// const wallet = new Wallet(provider)
// const chain = new Chain()

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      secondary: 'rgb(0, 255, 163) !important',
      hint: 'rgb(194, 63, 218) !important'
    }
  }
})

const chainSelector = (state: State) => state.chain
const setAccountsSelector = (state: State) => state.setAccounts
const walletSelector = (state: State) => state.wallet
const setConnectedSelector = (state: State) => state.setConnected
const clientSelector = (state: State) => state.client
// const transport = new HTTPTransport('http://0.0.0.0:8899')
// const client = new Client(new RequestManager([transport]))

const getRandom = (): number => {
  return Math.ceil(Math.random() * 1000) / 100
}

function App() {
  const setAccounts = useStore(setAccountsSelector)
  const setConnected = useStore(setConnectedSelector)
  const wallet = useStore(walletSelector)
  const client = useStore(clientSelector)
  const chain = useStore(chainSelector)

  const setDataForWallet = useCallback(async () => {
    const params = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        // TODO: change to user defined account, perhaps the wallet
        '2yyMk39x51tnNdjkRpDurjQvgAP7xK99nhACiJGpQ7BJ',
        // wallet.publicKey.toBase58(),
        { programId: TOKEN_PROGRAM_ID.toBase58() },
        { encoding: 'jsonParsed' }
      ]
    }

    const result = await client.request(params)
    const accounts = result.value
      .map((acct: Account) => {
        acct.account.data.grail = getRandom()
        acct.account.data.yolk = 10
        return acct
      })
      .sort(
        (a: Account, b: Account) => a.account.rentEpoch - b.account.rentEpoch
      )
    setAccounts(accounts)
  }, [setAccounts, client])

  useEffect(() => {
    wallet.on('connect', async (publicKey: any) => {
      console.log(`Connected to ${publicKey}`)
      setConnected(true)
      await setDataForWallet()
    })
    wallet.on('disconnect', () => {
      console.log('Disconnected')
      setConnected(false)
    })
    const f = async () => {
      await setDataForWallet()
    }
    f() //TODO: remove
    return () => wallet.disconnect()
  }, [setConnected, wallet, setDataForWallet])

  const testTransfer = async (_e: any) => {
    await chain.transferToStakeAccount(wallet)
  }

  const initApp = async () => {
    await chain.initApp(wallet)
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <EggsCard />
      <CreateEggCard />
      <div style={{ display: 'flex', maxWidth: '94%', marginLeft: '3%' }}>
        <div style={{ flex: 1, marginRight: "0.5%" }}>
          <MarketCard />
        </div>
        <div style={{ flex: 1, marginRight: "0.5%" }}>
          <DailyRewardsCard />
        </div>
      </div>
      <button onClick={testTransfer}>Transfer</button>
    </ThemeProvider>
  )
}

export default App

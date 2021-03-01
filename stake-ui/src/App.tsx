// cspell: ignore lamports pubkey blockhash txid
import React, { useEffect, useCallback } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
// @ts-ignore
import { Navbar } from './components/Navbar'
import { EggsCard } from './components/EggsCard'
import { CreateEggCard } from './components/CreateEggCard'
import { DailyRewardsCard } from './components/DailyRewardsCard'
import { MarketCard } from './components/MarketCard'
import { useStore, State, Account } from './store/app'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import Grid from '@material-ui/core/Grid'

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
    const accounts: Account[] = result.value.sort(
      (a: Account, b: Account) => a.account.rentEpoch - b.account.rentEpoch
    )
    const randoms: { [key: string]: number } = {}
    let sum = 0
    for (let i = accounts.length - 1; i >= 0; i--) {
      const key = accounts[i].account.rentEpoch.toString()
      if (!Object.keys(randoms).includes(key)) {
        const val = getRandom()
        sum += val
        sum = parseFloat(sum.toFixed(2))
        randoms[key] = sum
      }
      accounts[i].account.data.grail = randoms[key]
      accounts[i].account.data.yolk = 10
    }
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

  const initApp = async () => {
    await chain.initApp(wallet)
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <EggsCard />
      <CreateEggCard />
      <Grid container spacing={2} style={{ width: '95%', marginLeft: '2.5%' }}>
        <Grid item xs={12} md={6}>
          <MarketCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <DailyRewardsCard />
        </Grid>
      </Grid>
      {/* <button onClick={initApp}>Transfer</button> */}
    </ThemeProvider>
  )
}

export default App

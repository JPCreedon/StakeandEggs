// cspell: ignore lamports pubkey blockhash txid
import React, { useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
// @ts-ignore
import Wallet from '@project-serum/sol-wallet-adapter'
import { Navbar } from './components/Navbar'
import { EggsCard } from './components/EggsCard'
import { Chain } from './utils'

const provider = 'https://www.sollet.io'
const wallet = new Wallet(provider)
const chain = new Chain()

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      secondary: 'rgb(0, 255, 163) !important'
    }
  }
})

function App() {
  useEffect(() => {
    wallet.on('connect', (publicKey: any) => {
      console.log(`Connected to ${publicKey}`)
    })
    wallet.on('disconnect', () => console.log('Disconnected'))
    async function f() {
      await wallet.connect()
      console.log(wallet)
    }
    f()
    return () => wallet.disconnect()
  }, [])

  const testTransfer = async (e: any) => {
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
      <button onClick={initApp}>Initialize</button>
      <button onClick={testTransfer}>Transfer</button>
    </ThemeProvider>
  )
}

export default App

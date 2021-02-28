// cspell: ignore lamports pubkey blockhash txid
import React, {useState, useEffect, useRef} from 'react';
// import logo from './logo.svg';
// import './App.css';
import { Chain } from './utils'
// @ts-ignore
import Wallet  from '@project-serum/sol-wallet-adapter'
import { Connection, clusterApiUrl, SystemProgram, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { Navbar } from './components/Navbar'
import { EggsCard } from './components/EggsCard'
// const chain = new Chain()
// chain.createEmptyAccount()
const STAKE_ACCOUNT = new PublicKey('12kCrbwze2AVY2pF9LGuvUBKEQr8WZ43iZVr1GegdVSk')
const connection = new Connection(clusterApiUrl('devnet'))
const provider = 'https://www.sollet.io'
const wallet = new Wallet(provider)
const chain = new Chain()
const theme = createMuiTheme({ palette: { 
  type: 'dark', 
  text: {
    secondary: 'rgb(0, 255, 163) !important'  // green
    // secondary: 'rgb(3, 255, 255) !important'   // blue
    // secondary: 'rgb(194, 63, 218) !important' // purple
  }
} })
console.warn("THEME", theme)

function App() {
  const [key, setKey] = useState<string>('')
  const [pk, setPk] = useState('8vLNXZWuvFWb9WswqB19PD3s74GtoWfZrXvLTd7ZAuTt')
  // const [walletPk, setWalletPk] = useState('')
  
  useEffect(()=>{
    wallet.on('connect', (publicKey: any) => {
      console.log("----", wallet)
      console.log(`Connected to ${publicKey}`)
      // setWalletPk(publicKey)
    })
    wallet.on('disconnect', () => console.log('Disconnected'));
    async function f(){
      await wallet.connect()
      console.log(wallet)
    }
    f()
    return () => wallet.disconnect()  
  }, [])


  const testTransfer = async (e:any) => {
    await chain.transferToStakeAccount(wallet)
    // let transaction = new Transaction().add(
    //  SystemProgram.transfer({
    //     fromPubkey: wallet.publicKey,
    //     toPubkey: STAKE_ACCOUNT,
    //     lamports: LAMPORTS_PER_SOL,
    //   })
    // )

    // let { blockhash } = await connection.getRecentBlockhash();
    // // @ts-ignore
    // transaction.recentBlockhash = blockhash;
    // transaction.feePayer = wallet.publicKey;
    // let signed = await wallet.signTransaction(transaction);
    // let txid = await connection.sendRawTransaction(signed.serialize());
    // await connection.confirmTransaction(txid);
  }


  const handleFileChange = (e:any) => {
      console.log('Reading program file')
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (content) {
          setKey(content as string)
          console.log('Read complete')
        }
      }
      
      const file = e.target.files[0]
      reader.readAsText(file)
  }

  const handleExchange = (e: any) => {
    return
    // chain.transferSOLFromUserAccount(pk, key)
  }

  const handlePublicKeyChange = (e:any) => {
    setPk(e.target.value)
  }

  const initApp = async () => {
    await chain.initApp(wallet)
  }
  return (
    // <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <EggsCard />
      Private key file <input type="file" onChange={handleFileChange} />
      <p>owner public key</p>
      <input type="text" value={pk} onChange={handlePublicKeyChange} />
      <button onClick={initApp}>Initialize</button>
      <button onClick={handleExchange}>Exchange</button>
      <button onClick={testTransfer}>Transfer</button>
      
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <h1>{chain.getAccount()}</h1> */}
      </ThemeProvider>
    // </div>
  );
}

export default App;

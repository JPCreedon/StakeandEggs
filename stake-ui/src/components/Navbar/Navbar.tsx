import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import { useStyles } from './styles'
import { useStore, State } from '../../store/app'
import logo from './logo.png'

const walletSelector = (state: State) => state.wallet
const connectedSelector = (state: State) => state.connected

const Navbar: React.FC = () => {
  const classes = useStyles()
  const wallet = useStore(walletSelector)
  const connected = useStore(connectedSelector)

  const handelConnect = async () => {
    console.log('BEFORE', wallet.connected)
    console.log('BEFORE', wallet.publicKey)
    await wallet.connect()
    console.log('AFTER', wallet.connected)
    console.log('AFTER', wallet.publicKey)
    console.log(wallet)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <div style={{ position: 'absolute', height: '100%' }}>
            <img alt="logo" src={logo} className={classes.logo} />
          </div>
          <Typography variant="h6" className={classes.title}>
            Stake &amp; Eggs
          </Typography>
          <Button onClick={handelConnect} color="inherit">
            {/* {connected ? wallet.publicKey.toBase58() : 'Connect Wallet'} */}
            {connected ? 'CHANGE BACK TO WALLET' : 'Connect Wallet'} {/* TODO: REMOVE */}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar

import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import { useStore, State, Account } from '../../store/app'
import { GREEN } from '../../colors'
import { Egg } from '../Egg'
// import Notification from './Notification'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const dialogVisibleSelector = (state: State) => state.dialogs.redeemEgg
const setDialogVisibleSelector = (state: State) => state.setDialogVisible
const accountsSelector = (state: State) => state.accounts
const clientSelector = (state: State) => state.client
const selectedEggSelector = (state: State) => state.selectedEggPublicKey

const RedeemEggDialog: React.FC = () => {
  const [eggData, setEggData] = useState({
    yolk: 0,
    grail: 0,
    epoch: 0,
    rent: 0
  })
  const dialogVisible = useStore(dialogVisibleSelector)
  const setDialogVisible = useStore(setDialogVisibleSelector)
  const client = useStore(clientSelector)
  const accounts = useStore(accountsSelector)
  const selectedEgg = useStore(selectedEggSelector)

  useEffect(() => {
    const f = async () => {
      const eggAccount = accounts.find((d: Account) => d.pubkey === selectedEgg)
      const rentParams = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getMinimumBalanceForRentExemption',
        params: [16]
      }
      const epochParams = { jsonrpc: '2.0', id: 1, method: 'getEpochInfo' }
      const rentRes = await client.request(rentParams)
      const epochRes = await client.request(epochParams)
      setEggData({
        yolk: eggAccount?.account.data.yolk,
        grail: eggAccount?.account.data.grail,
        rent: rentRes,
        epoch: epochRes.epoch + 1
      })
    }
    f()
  }, [accounts, client, selectedEgg])

  const handleClose = () => {
    setDialogVisible('redeemEgg', false)
  }
  return (
    <div>
      <Dialog
        open={dialogVisible}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <Egg showYolkOnHover={false} large />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="h6">You will receive</Typography>
              <Typography variant="h3">
                {(eggData.grail + eggData.yolk).toFixed(2)} SOL
              </Typography>
              <Typography variant="body1" style={{ marginTop: 8 }}>
                At epoch {eggData.epoch}. We will then transfer your yolk (
                {eggData.yolk}) and grail ({eggData.grail}) rewards
              </Typography>
              <Typography variant="body2" style={{ marginTop: 8 }}>
                Your egg will be made into omelettes (burnt) once the
                transaction is confirmed. <br />
                Your rent of {eggData.rent} lamports will be released
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => {}} style={{ color: GREEN }}>
            REDEEM
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Notification open={showNotification} setOpen={setShowNotification} /> */}
    </div>
  )
}

export default RedeemEggDialog

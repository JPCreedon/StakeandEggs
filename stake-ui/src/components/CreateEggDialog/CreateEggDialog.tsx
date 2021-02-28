import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import { useStore, State } from '../../store/app'
import { PURPLE } from '../../colors'
import { Egg } from '../Egg'
import Notification from './Notification'

const setDialogVisibleSelector = (state: State) => state.setDialogVisible
const dialogVisibleSelector = (state: State) => state.dialogs.createEgg
const clientSelector = (state: State) => state.client
const chainSelector = (state: State) => state.chain
const walletSelector = (state: State) => state.wallet

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const CreateEggDialog: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false)
  const dialogVisible = useStore(dialogVisibleSelector)
  const setDialogVisible = useStore(setDialogVisibleSelector)
  const client = useStore(clientSelector)
  const [rentExemption, setRentExemption] = useState(0)
  const chain = useStore(chainSelector)
  const wallet = useStore(walletSelector)

  const handleClose = () => {
    setDialogVisible('createEgg', false)
  }

  useEffect(() => {
    const f = async () => {
      const params = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getMinimumBalanceForRentExemption',
        params: [16]
      }
      const res = await client.request(params)
      setRentExemption(res)
    }
    f()
  }, [client])

  const buyEgg = async () => {
    await chain.transferToStakeAccount(wallet)
    setDialogVisible('createEgg', false)
    setShowNotification(true)
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
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <Egg withPrice={false} />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="h6">You will receive</Typography>
              <Typography variant="h6">1 Egg Epoch</Typography>
              <Typography variant="body2">
                Your transaction will be 10 SOL for the egg and {rentExemption}{' '}
                lamports for rent exemption
              </Typography>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={buyEgg} style={{ color: PURPLE }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Notification open={showNotification} setOpen={setShowNotification} />
    </div>
  )
}
export default CreateEggDialog

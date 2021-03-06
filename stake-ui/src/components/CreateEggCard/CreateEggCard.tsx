import React, { useState, useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { Egg } from '../Egg'
import { useStore, State } from '../../store/app'
import { useStyles } from './styles'
import { CreateEggDialog } from '../CreateEggDialog'

const clientSelector = (state: State) => state.client
const connectedSelector = (state: State) => state.connected
const setDialogVisibleSelector = (state:State) => state.setDialogVisible

const CreateEggCard: React.FC = () => {
  const classes = useStyles()
  const [currentEpoch, setCurrentEpoch] = useState({epoch: 0, slotIndex: 0, slotsInEpoch: 0})
  const client = useStore(clientSelector)
  const setDialogVisible = useStore(setDialogVisibleSelector)
  const connected = useStore(connectedSelector)

  useEffect(() => {
      const interval = setInterval(async ()=>{
        const params = {
          jsonrpc: '2.0',
          method: 'getEpochInfo'
        }
        const res = await client.request(params)
        setCurrentEpoch(res)
      }, 5000)
      return () => clearInterval(interval)
  }, [client])

  const getRoundEpoch = (): number => {
    /**
     * @returns Epoch completion in rounded percentage
     */
    return Math.ceil((currentEpoch.slotIndex/currentEpoch.slotsInEpoch) * 100000)/1000
  }

  const handleClick = () => {
    setDialogVisible('createEgg', true)
  }

  return (
    <Paper className={classes.paper} elevation={24}>
      <CreateEggDialog />
      <Typography className={classes.text} variant="h5">
        Create an Egg
      </Typography>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Egg showYolkOnHover={false} />
        </div>
        <div style={{ flex: 1 }}>
          <Typography className={classes.text} variant="h6">
            Cost: 10.00 SOL
          </Typography>
          <Typography className={classes.text} variant="h6">
            Current Epoch: {currentEpoch.epoch}{' '}
          </Typography>
          <Typography className={classes.text} variant="h6">
            Completion: {currentEpoch.slotIndex}/{currentEpoch.slotsInEpoch} Slots  ({getRoundEpoch()}%)
          </Typography>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Button
            className={classes.button}
            onClick={handleClick}
            variant="contained"
            disabled={!connected}
          >
            Create
          </Button>
        </div>
      </div>
    </Paper>
  )
}

export default CreateEggCard

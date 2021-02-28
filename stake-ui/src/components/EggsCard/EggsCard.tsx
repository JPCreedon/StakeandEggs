// cspell: ignore cumsum
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
// @ts-ignore
import C3Chart from 'react-c3js'
import { Egg } from '../Egg'
import { RedeemEggDialog } from '../RedeemEggDialog'
import { useStore, State, Account } from '../../store/app'
import { useStyles } from './styles'
import 'c3/c3.css'

const accountsSelector = (state: State) => state.accounts
const selectedEggSelector = (state: State) => state.selectedEggPublicKey
const setDialogVisibleSelector = (state: State) => state.setDialogVisible

const EggsCard: React.FC = () => {
  const accounts = useStore(accountsSelector)
  const selectedEgg = useStore(selectedEggSelector)
  const setDialogVisible = useStore(setDialogVisibleSelector)

  const cumsum = (): { x: number[]; y: number[] } => {
    /**
     * @returns the cumulative sum of the eggs
     */
    const res = accounts.reduce((acc: any, account: Account) => {
      const k = account.account.rentEpoch.toString()
      acc[k] += account.account.data.grail + account.account.data.yolk
      return acc
    }, getXLabels())
    const cumY: number[] = []
    Object.values(res).reduce(
      (prev: any, curr: any, i) => (cumY[i] = prev + curr),
      0
    )
    return {
      x: Array.from(new Set(Object.keys(res).map((d) => parseInt(d)))),
      y: cumY
    }
  }

  const getXLabels = (): number[] => {
    /**
     * @returns all the epochs between the first and the last one
     */
    const epochs = accounts.map((d: Account) => d.account.rentEpoch)
    const max = Math.max.apply(null, epochs)
    const min = Math.min.apply(null, epochs)
    return Array.from({ length: max - min }, (v, k) => k + min).reduce(
      (acc: any, d: number) => {
        acc[d.toString()] = 0
        return acc
      },
      {}
    )
  }
  const classes = useStyles()
  const _data = cumsum()
  const data = {
    x: 'x',
    type: 'bar',
    columns: [
      ['x', ..._data.x],
      ['SOL', ..._data.y]
    ],
    colors: { SOL: 'rgb(0, 255, 163)' }
  }
  const axis = {
    x: { label: 'Epoch', values: getXLabels(), localTime: false },
    y: { label: 'SOL' }
  }
  const bar = { width: { ratio: 0.5 } }
  const interaction = { enabled: false }

  const handleRedeemClick = () => {
    setDialogVisible('redeemEgg', true)
  }

  return (
    <Paper elevation={24} className={classes.paper}>
      <Typography color="textSecondary" variant="h5">
        My Eggs
      </Typography>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 0.5, maxHeight: '30vh'  , overflowX: 'scroll' }}>
          {accounts.map((d: any) => (
            <Egg key={`egg-${d.pubkey}`} epoch={d.account.rentEpoch} publicKey={d.pubkey} />
          ))}
        </div>
        <div className={classes.buttonsPanel}>
          <Button
            className={classes.redeemButton}
            fullWidth
            disabled={!selectedEgg}
            onClick={handleRedeemClick}
            variant="contained"
            color="primary"
          >
            Redeem
          </Button>
          <Button
            className={classes.listButton}
            fullWidth
            onClick={() => {}}
            variant="outlined"
            color="secondary"
          >
            List
          </Button>
        </div>
        <div style={{ flex: 0.6 }}>
          <C3Chart
            className={classes.chart}
            data={data}
            axis={axis}
            interaction={interaction}
            bar={bar}
          />
        </div>
      </div>
      <RedeemEggDialog />
    </Paper>
  )
}

export default EggsCard

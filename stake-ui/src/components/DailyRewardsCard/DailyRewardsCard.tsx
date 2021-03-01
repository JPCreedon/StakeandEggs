// cspell: ignore cumsum
import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { useStyles, BLUE } from './styles'
import { useStore, State, Account } from '../../store/app'
// @ts-ignore
import C3Chart from 'react-c3js'
import 'c3/c3.css'

const bar = { width: { ratio: 0.5 } }
const interaction = { enabled: true }

const accountsSelector = (state: State) => state.accounts

const DailyRewardsCard: React.FC = () => {
  const accounts = useStore(accountsSelector)
  const classes = useStyles()

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

  const getChartData = (): { x: number[]; y: number[] } => {
    /**
     * @returns the cumulative sum of the eggs
     */
    const res = accounts.reduce((acc: any, account: Account) => {
      const k = account.account.rentEpoch.toString()
      acc[k] += account.account.data.grail
      return acc
    }, getXLabels())
    return {
      x: Array.from(new Set(Object.keys(res).map((d) => parseInt(d)))),
      y: Object.values(res)
    }
  }
  const _data = getChartData()
  const data = {
    x: 'x',
    type: 'bar',
    columns: [
      ['x', ..._data.x],
      ['SOL', ..._data.y]
    ],
    colors: { SOL: BLUE }
  }

  const axis = {
    x: {
      label: 'Epoch',
      values: _data.x,
      localTime: false
    },
    y: { label: 'SOL' }
  }

  const tooltip = {
    format: {
      title: (x: any) => `Epoch ${x}`,
      value: (val: any) => parseFloat(val).toFixed(3)
    }
  }

  return (
    <Paper elevation={24} className={classes.paper}>
      <Typography className={classes.text} variant="h5">
        Rewards per Epoch
      </Typography>
      <C3Chart
        data={data}
        className={classes.chart}
        axis={axis}
        interaction={interaction}
        bar={bar}
        tooltip={tooltip}
      />
    </Paper>
  )
}

export default DailyRewardsCard

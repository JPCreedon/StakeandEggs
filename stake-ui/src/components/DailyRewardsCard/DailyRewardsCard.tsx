import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { useStyles, BLUE } from './styles'
// @ts-ignore
import C3Chart from 'react-c3js'
import 'c3/c3.css'

const _data: { x: Date[]; y: number[] } = { x: [], y: [] }
const DAY = 60 * 60 * 24 * 1000
let today = new Date().getTime() - 20 * DAY
for (let i = 0; i < 20; i++) {
  _data.x.push(new Date(today))
  today += DAY
  _data.y.push(Math.random() + Math.random())
}

const data = {
  x: 'x',
  type: 'bar',
  // xFormat: '%Y-%m-%d',
  columns: [
    ['x', ..._data.x],
    ['SOL', ..._data.y]
  ],
  colors: { SOL: BLUE }
}

const axis = {
  x: {
    label: 'x',
    values: _data.x,
    localTime: false,
    type: 'timeseries',
    tick: {
      format: '%Y-%m-%d'
    }
  },
  y: { label: 'SOL' }
}
const bar = { width: { ratio: 0.5 } }
const interaction = { enabled: false }

const DailyRewardsCard: React.FC = () => {
  const classes = useStyles()
  return (
    <Paper elevation={24} className={classes.paper}>
      <Typography className={classes.text} variant="h5">
        Daily Rewards
      </Typography>
      <C3Chart
        data={data}
        className={classes.chart}
        axis={axis}
        interaction={interaction}
        bar={bar}
      />
    </Paper>
  )
}

export default DailyRewardsCard

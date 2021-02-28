import React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { BuyEggCard } from '../BuyEggCard'
import { useStyles } from './styles'

const MarketCard: React.FC = () => {
  const classes = useStyles()
  return (
    <Paper elevation={24} className={classes.paper}>
      <Typography className={classes.text} variant="h5">
        Egg Marketplace
      </Typography>

      <div style={{ flex: 0.5, maxHeight: '31vh'  , overflow: 'scroll' }}>
        <BuyEggCard />
        <BuyEggCard />
        <BuyEggCard />
        <BuyEggCard />
        <BuyEggCard />
      </div>
    </Paper>
  )
}

export default MarketCard

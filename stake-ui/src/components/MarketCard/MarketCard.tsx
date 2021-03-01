import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { BuyEggCard } from '../BuyEggCard'
import { useStyles } from './styles'
import { useStore, State, Account } from '../../store/app'

interface CardData {
  discount: number
  epoch: number
}

const accountsSelector = (state: State) => state.accounts

const MarketCard: React.FC = () => {
  const [data, setData] = useState<CardData[]>([])
  const accounts = useStore(accountsSelector)

  const getRandomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max + 1)) + min
  }

  useEffect(() => {
    const epochs = accounts.map((d: Account) => d.account.rentEpoch)
    const maxEpoch = Math.max.apply(null, epochs)
    const _data: CardData[] = []
    for (let i = 0; i < 10; i++) {
      const premium = Math.random() > 0.5 ? 1 : -1
      _data.push({
        epoch: getRandomBetween(1, maxEpoch),
        discount: getRandomBetween(1 * premium, premium * 5)
      })
    }
    setData(_data)
  }, [accounts])

  const classes = useStyles()
  return (
    <Paper elevation={24} className={classes.paper}>
      <Typography className={classes.text} variant="h5">
        Egg Marketplace
      </Typography>

      <div style={{ flex: 0.5, maxHeight: '31vh', overflow: 'scroll' }}>
        {data
          .sort((a, b) => a.epoch - b.epoch)
          .map((d, i) => (
            <BuyEggCard key={i} discount={d.discount} epoch={d.epoch} />
          ))}
      </div>
    </Paper>
  )
}

export default MarketCard

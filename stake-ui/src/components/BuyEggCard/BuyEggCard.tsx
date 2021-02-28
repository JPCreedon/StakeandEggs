import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Egg } from '../Egg'
import { useStyles } from './styles'

const BuyEggCard: React.FC = () => {
  const classes = useStyles()
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <Egg withPrice={false} />
      </div>
      <div style={{ flex: 1 }}>
        <Typography variant="body2" color="textPrimary">
          Epoch: 30
        </Typography>
        <Typography variant="body2" color="textPrimary">
          Discount: 3%
        </Typography>
      </div>
      <div style={{ flex: 1 }}>
        <Button className={classes.button} onClick={() => {}}>
          Buy
        </Button>
      </div>
    </div>
  )
}

export default BuyEggCard

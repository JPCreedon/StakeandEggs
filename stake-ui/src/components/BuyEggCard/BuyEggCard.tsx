import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Egg } from '../Egg'
import { useStyles } from './styles'

interface Props {
  discount: number
  epoch: number
}

const BuyEggCard: React.FC<Props> = ({ discount, epoch }) => {
  const classes = useStyles()
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <Egg showYolkOnHover={false} />
      </div>
      <div style={{ flex: 1 }}>
        <Typography variant="body2" color="textPrimary">
          Epoch: {epoch}
        </Typography>
        <Typography variant="body2" color="textPrimary">
          {discount === 0
            ? 'Market Price'
            : discount > 0
            ? `Premium: ${Math.abs(discount)}%`
            : `Discount: ${Math.abs(discount)}%`}
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

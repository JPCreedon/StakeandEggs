import React from 'react'
import { useStyles } from './styles'
import Typography from '@material-ui/core/Typography'

interface Props {
  epoch?: number
  withPrice?: boolean
}

const getRandom = (): number => {
  return Math.ceil(Math.random() * 1000) / 100
}
const Egg: React.FC<Props> = ({ epoch, withPrice }) => {
  const classes = useStyles()

  return (
    <div className={classes.egg}>
      <div className={classes.eggDetails}>
        {epoch && <Typography variant="body2">Epoch #{epoch}</Typography>}
        {withPrice && <Typography variant="body2">Yolk: 10.00 </Typography>}
        {withPrice && (
          <Typography variant="body2">Grail: {getRandom()} </Typography>
        )}
      </div>
    </div>
  )
}

Egg.defaultProps = {
  withPrice: true
}

export default Egg

import React from 'react'
import { useStyles } from './styles'
import Typography from '@material-ui/core/Typography'
import { useStore, State } from '../../store/app'
import clsx from 'clsx'

interface Props {
  epoch?: number
  withPrice?: boolean
  showYolkOnHover?: boolean
  publicKey?: string
  large?: boolean
}

const setSelectedEggSelector = (state: State) => state.setSelectedEggPublicKey
const selectedEggSelector = (state: State) => state.selectedEggPublicKey

const getRandom = (): number => {
  return Math.ceil(Math.random() * 1000) / 100
}
const Egg: React.FC<Props> = ({
  epoch,
  withPrice,
  showYolkOnHover,
  publicKey,
  large
}) => {
  const classes = useStyles()
  const selectedEgg = useStore(selectedEggSelector)
  const setSelectedEgg = useStore(setSelectedEggSelector)

  const handleClick = () => {
    if (publicKey) {
      if (selectedEgg === publicKey) {
        setSelectedEgg(undefined)
      } else {
        setSelectedEgg(publicKey)
      }
    }
  }

  return (
    <div
      className={clsx(
        showYolkOnHover ? classes.yolk : classes.egg,
        { [classes.selected]: selectedEgg && selectedEgg === publicKey },
        { [classes.large]: large }
      )}
      onClick={handleClick}
    >
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
  withPrice: true,
  showYolkOnHover: true,
  large: false
}

export default Egg

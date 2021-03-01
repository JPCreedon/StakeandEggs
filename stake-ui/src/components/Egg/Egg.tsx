import React from 'react'
import { useStyles } from './styles'
import Typography from '@material-ui/core/Typography'
import { useStore, State } from '../../store/app'
import clsx from 'clsx'

interface Props {
  epoch?: number
  showYolkOnHover?: boolean
  publicKey?: string
  large?: boolean
  yolk?: number
  grail?: number
}

const setSelectedEggSelector = (state: State) => state.setSelectedEggPublicKey
const selectedEggSelector = (state: State) => state.selectedEggPublicKey

const Egg: React.FC<Props> = ({
  epoch,
  showYolkOnHover,
  publicKey,
  large,
  yolk,
  grail
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
        {!!yolk && <Typography variant="body2">Yolk: {yolk} </Typography>}
        {!!grail && <Typography variant="body2">Grail: {grail} </Typography>}
      </div>
    </div>
  )
}

Egg.defaultProps = {
  showYolkOnHover: true,
  large: false
}

export default Egg

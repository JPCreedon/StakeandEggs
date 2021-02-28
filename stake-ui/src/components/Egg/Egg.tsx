import React from 'react'
import { useStyles } from './styles'
import Typography from '@material-ui/core/Typography'

interface Props {
  epoch: number
}

const getRandom = ():number => {
  return Math.ceil(Math.random()*1000)/100
}
const Egg: React.FC<Props> = ({ epoch }) => {
  
  const classes = useStyles()

  return (
    <div className={classes.egg}>
      <div className={classes.eggDetails}>
      <Typography variant="body2" >Epoch #{epoch}</Typography>
      <Typography variant="body2" >Yolk: 10.00 </Typography>
      <Typography variant="body2" >Grail: {getRandom()} </Typography>
      </div>
    </div>
  )
}

export default Egg
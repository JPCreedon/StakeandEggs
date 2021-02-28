import {Theme, makeStyles, createStyles} from '@material-ui/core/styles'
import { LIGHT_GREEN } from '../../colors'

export const useStyles = makeStyles((theme: Theme) => createStyles({
  egg: {
    display: 'inline-block',
    margin: theme.spacing(3),
    backgroundImage: "url('/egg.png')",
    height: theme.spacing(12),
    width: theme.spacing(12),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    alignItems: 'flex-end',
    color: '#FFF',
    position: 'relative'
  },
  yolk: {
    display: 'inline-block',
    margin: theme.spacing(3),
    backgroundImage: "url('/egg.png')",
    height: theme.spacing(12),
    width: theme.spacing(12),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    alignItems: 'flex-end',
    color: '#FFF',
    position: 'relative',
    '&:hover': {
      backgroundImage: "url('/yolk.png')",
    }
  },
  eggDetails: {
    bottom: 0,
    position: 'absolute',
    transform: 'translate(0px ,64px)',
    marginBottom: 8
  },
  selected: {
    backgroundColor: LIGHT_GREEN
  },
  large: {
    height: '30vh',
    width: '30vh'
  }
}))
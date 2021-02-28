import {Theme, makeStyles, createStyles} from '@material-ui/core/styles'

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

    
  }
}))
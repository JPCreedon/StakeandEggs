import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    maxWidth: '94%',
    marginLeft: '3%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  eggIcon: {
    maxHeight: 120
  },
  chart: {
    '&  .domain': {
      fill: 'none',
      strokeWidth: 1,
      stroke: '#fff'
    },
    '& .tick, & text': {
      fill: '#fff',
      strokeWidth: 1
    }
  },
  buttonsPanel: {
    flex: 0.15, 
    padding: '0px 16px',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'
  },
  redeemButton: {
    color: '#303030',
    backgroundColor: 'rgb(0, 255, 163)'
  },
  listButton: {
    color: 'rgb(0, 255, 163)',
    borderColor: 'rgb(0, 255, 163)'
  }
}))
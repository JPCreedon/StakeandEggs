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
    '& line': {
      stroke: '#FFF'
    },
    '& .tick, & text': {
      fill: '#fff',
      strokeWidth: 1
    },
    '& .c3-tooltip th': {
      backgroundColor: 'rgba(30,30,30,0.8)'
    },
    ' & .c3-tooltip td': {
      backgroundColor: 'rgba(30,30,30,0.7)'
    },
    '& .c3-tooltip tr': {
      border: '1px rgba(30,30,30,1) solid'
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
    backgroundColor: 'rgb(0, 255, 163)',
    '&:hover': {
      backgroundColor: 'rgba(0, 255, 163,0.6)',
      color: '#303030',
      borderColor: 'rgb(0, 255, 163)'
    }
  },
  listButton: {
    color: 'rgb(0, 255, 163)',
    borderColor: 'rgb(0, 255, 163)',
    '&:hover': {
      backgroundColor: 'rgba(0, 255, 163,0.1)',
      color: 'rgb(0, 255, 163)',
      borderColor: 'rgb(0, 255, 163)'
    }
  }
}))
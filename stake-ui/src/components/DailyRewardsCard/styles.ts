import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
export const BLUE = 'rgb(3, 225, 255)'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      // maxWidth: '94%',
      // marginLeft: '3%',
      padding: theme.spacing(2),
      marginTop: theme.spacing(4)
    },
    text: {
      color: BLUE
    },
    chart: {
      '& .domain': {
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
    }
  })
)

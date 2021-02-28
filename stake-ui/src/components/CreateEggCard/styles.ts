import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
const PURPLE = 'rgb(194, 63, 218)'
const PURPLE_LIGHT = 'rgba(194, 63, 218, 0.6)'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: '94%',
      marginLeft: '3%',
      padding: theme.spacing(2),
      marginTop: theme.spacing(4)
    },
    text: {
      color: PURPLE
    },
    button: {
      backgroundColor: PURPLE,
      color: '#303030',
      width: '30%',
      '&:hover': {
        backgroundColor: PURPLE_LIGHT
      }
    }
  })
)

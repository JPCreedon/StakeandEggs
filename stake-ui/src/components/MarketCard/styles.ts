import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
export const BLUE = 'rgb(3, 225, 255)'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      height: '92%',
      // maxWidth: '94%',
      // marginLeft: '3%',
      padding: theme.spacing(2),
      marginTop: theme.spacing(4)
    },
    text: {
      color: BLUE
    }
  })
)

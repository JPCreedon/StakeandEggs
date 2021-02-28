import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
export const BLUE = 'rgb(3, 225, 255)'
export const LIGHT_BLUE = 'rgba(3, 225, 255, 0.6)'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      backgroundColor: BLUE,
      color: '#303030',
      '&:hover': {
        backgroundColor: LIGHT_BLUE
      }
    }
  })
)

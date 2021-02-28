import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { GREEN } from '../../colors'
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    notification: {
      '& .MuiPaper-root': {
        backgroundColor: `${GREEN} !important`
      }
    }
  })
)

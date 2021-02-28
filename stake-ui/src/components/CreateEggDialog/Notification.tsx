import React from 'react'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useStyles } from './styles'

interface Props {
  open: boolean
  setOpen: (visible: boolean) => void
}

const Notification: React.FC<Props> = ({ open, setOpen }) => {
  const classes = useStyles()

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div>
      <Snackbar
        className={classes.notification}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Egg purchased successfully"
        action={
          <React.Fragment>

            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  )
}
export default Notification

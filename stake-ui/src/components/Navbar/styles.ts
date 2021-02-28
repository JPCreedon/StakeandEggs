import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
createStyles({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundColor: 'rgb(43, 43, 43)'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: 70

  },
  logo: {
    height: '100%',
    transform: 'translate(-20px, 0)'
  }
}),
);
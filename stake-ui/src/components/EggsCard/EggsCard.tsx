import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
// import Card from '@material-ui/core/Card'
// import CardContent from '@material-ui/core/CardContent'
// import CardHeader from '@material-ui/core/CardHeader'
const EggsCard: React.FC = () => {

  return (
    <Paper elevation={4}>
      <Typography color="textPrimary" variant="h5">My Eggs</Typography>

    </Paper>
  )
}

export default EggsCard
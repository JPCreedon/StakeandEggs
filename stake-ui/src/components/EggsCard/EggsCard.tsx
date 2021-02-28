import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useStyles } from './styles'
import { Egg } from '../Egg'
// @ts-ignore
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
// import egg from './egg.png'

// import Card from '@material-ui/core/Card'
// import CardContent from '@material-ui/core/CardContent'
// import CardHeader from '@material-ui/core/CardHeader'



const transport = new HTTPTransport("http://localhost:8899");
const client = new Client(new RequestManager([transport]));


const EggsCard: React.FC = () => {
  const [accounts, setAccounts] = useState([])
  useEffect(()=>{
    const f = async () => {
      const params = {
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          "2yyMk39x51tnNdjkRpDurjQvgAP7xK99nhACiJGpQ7BJ",
          {programId: TOKEN_PROGRAM_ID.toBase58()},
          {encoding: "jsonParsed"}
        ]
      }

      const result = await client.request(params)
      console.debug("************************************")
      console.debug(result)
      setAccounts(result.value)
      console.debug("************************************")

    }
    f()
  }, [])
  const _data = []
  const _values = []
  let today = new Date().getTime()
  for (let i=10; i<80; i+=2) {
    _data.push(i + (Math.random ()) )
    _values.push(new Date(today));
    today += 86400000
  }
  const classes = useStyles()
  const data = {
    x: 'x',
    xFormat: '%Y',
    type: 'bar',
    columns: [
      ['x', ..._values],
      ['data1', ..._data]
    ],
    colors: {data1: 'rgb(0, 255, 163)'},
    axis: {
      y:  {
        label: 'aaaa'
      }
    }
  };
  const axis = {
    x: {
      label: 'Time', 
      type: 'timeseries',
      values: _values,
      localTime: false,
      tick: {
        format: '%Y-%m-%d',
        culling: {
          max: 5
        }
    }
    },
    y: {label: 'SOL'}
  }
  const interaction = {
    enabled: false
  }
  
  
  return (
    <Paper elevation={24} className={classes.paper}>
      <Typography color="textSecondary" variant="h5">My Eggs</Typography>

      <div style={{display: 'flex'}}>
        <div style={{flex: 0.5, maxHeight: '30vh', overflowX: 'scroll'}}>
          {/* {[1,2,3,4,5,6].map(d => (<img src={egg} alt="egg" key={`egg-${d}`} className={classes.eggIcon} />))} */}
          {accounts.sort((a:any,b:any) => a.account.rentEpoch - b.account.rentEpoch).map((d: any) => (<Egg key={`egg-${d.pubkey}`} epoch={d.account.rentEpoch} />))}

        </div>
        <div className={classes.buttonsPanel}>
          <Button className={classes.redeemButton} fullWidth onClick={()=>{}} variant="contained" color="primary">Redeem</Button>
          <Button className={classes.listButton} fullWidth onClick={()=>{}} variant="outlined" color="secondary">List</Button>
        </div>
        <div style={{flex: 0.6}}>
          <C3Chart className={classes.chart} data={data} axis={axis} interaction={interaction} />
        </div>
        
      </div>

    </Paper>
  )
}

export default EggsCard
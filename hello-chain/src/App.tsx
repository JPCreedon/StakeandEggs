import React, { useEffect, useState } from 'react'
import { Chain } from './utils'
import { Console, Hook, Unhook } from 'console-feed'
import { Message as MessageConsole } from 'console-feed/lib/definitions/Console'
import { Message as MessageComponent } from 'console-feed/lib/definitions/Component'
import './App.css'

const chain = new Chain()
const App: React.FC = () => {
  const [data, setData] = useState<number>(-1)
  const [logs, setLogs] = useState<MessageConsole[]>([])
  const [program, setProgram] = useState<string | ArrayBuffer>()
  const [deployDisabled, setDeployDisabled] = useState(true)

  useEffect(() => {
    Hook(
      window.console,
      (log) => setLogs((currLogs) => [...currLogs, log]),
      false
    )
    return () => Unhook(window.console as any) as any
  }, [])

  const handleFile = (e: any) => {
    console.log('Reading program file')
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (content) {
        setProgram(content)
        console.log('Read complete')
      }
    }
    if (e.target.files.length === 1) {
      setDeployDisabled(false)
    } else {
      setDeployDisabled(true)
    }
    const file = e.target.files[0]
    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    console.info('Polling the chain every 1 second')
    const interval = setInterval(async () => {
      const res = await chain.getAccountInfo()
      setData(res.numGreets)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDeploy = async () => {
    await chain.loadProgram(program as ArrayBuffer)
  }

  const clear = (_e: any) => {
    setLogs([])
    Promise.resolve(localStorage.clear())
    setDeployDisabled(true)
  }

  return (
    <>
      <div className="container">
        <div className="app-controls">
          <h1>Hello World Exec. Counter</h1>
          <h2>Step 1 - Load Program</h2>
          <div>
            <input type="file" onChange={handleFile} accept=".so" />
            <button onClick={handleDeploy} disabled={deployDisabled}>
              Deploy
            </button>
          </div>

          <div>
            <h2> Step 2 - Call the program</h2>
            <button
              onClick={chain.sayHello}
              disabled={chain.getKeys().programId === 'Undefined'}
            >
              Say Hello
            </button>
            <p style={{ border: '1px solid' }}>Program called {data} times</p>
          </div>
          <h2>Public Key</h2>
          <ul style={{ textAlign: 'left', wordWrap: 'normal' }}>
            <li>Program Account Key: {chain.getKeys().programId}</li>
            <li>Receiver Account Key: {chain.getKeys().publicKey}</li>
            <li>Payer Account Key: {chain.getKeys().payerKey}</li>
          </ul>
          <button onClick={clear}>Reset</button>
        </div>
        <div className="app-console">
          <Console logs={logs as MessageComponent[]} variant="dark" />
        </div>
      </div>
    </>
  )
}

export default App

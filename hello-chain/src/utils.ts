// cspell: ignore solana pubkey lamports
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  Account,
  Transaction,
  sendAndConfirmTransaction,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID,
  SystemProgram
} from '@solana/web3.js'
// @ts-ignore
import BufferLayout from 'buffer-layout'

export interface IGreet {
  numGreets: number
}

const greetedAccountDataLayout = BufferLayout.struct([
  BufferLayout.u32('numGreets')
])

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class Chain {
  INIT_AMOUNT = 1000000000
  CLUSTER_URL = 'http://devnet.solana.com'
  connection: Connection
  programId: PublicKey | null
  publicKey: PublicKey | null
  payerAccount: Account | null

  constructor() {
    this.connection = new Connection(this.CLUSTER_URL)
    this.programId = null
    Promise.resolve(localStorage.getItem('hello-world-prog-id')).then(
      (_programId) => {
        if (typeof _programId === 'string') {
          this.programId = new PublicKey(_programId)
        }
      }
    )
    this.publicKey = null
    Promise.resolve(localStorage.getItem('hello-world-public-key')).then(
      (_publicKey) => {
        if (typeof _publicKey === 'string') {
          this.publicKey = new PublicKey(_publicKey)
        }
      }
    )
    this.payerAccount = null
  }

  getAccountInfo = async (): Promise<IGreet> => {
    // await initConnection()
    if (!this.connection || !this.publicKey) {
      return { numGreets: 0 }
    }
    const accountInfo = await this.connection.getAccountInfo(this.publicKey)
    if (accountInfo && accountInfo.data) {
      return greetedAccountDataLayout.decode(Buffer.from(accountInfo!.data))
    }
    return { numGreets: 0 }
  }

  createPayerAccount = async () => {
    console.log('Creating new account')
    const account = new Account()
    console.log('Requesting airdrop with 1,000,000,000 SOL')
    await this.connection.requestAirdrop(account.publicKey, this.INIT_AMOUNT)

    let balance = 0
    while (!balance) {
      console.log('Waiting for account balance to be updated on the chain')
      balance = await this.connection.getBalance(account.publicKey)
      await sleep(1000)
    }
    console.debug('Success')
    console.log(`Payer Account Balance: ${balance}`)
    console.log(`Payer Account public key: ${account.publicKey.toBase58()}`)
    this.payerAccount = account
  }

  sayHello = async () => {
    if (!this.payerAccount) {
      console.log('%cInitializing payer account', 'font-weight: 900')
      await this.createPayerAccount()
    }
    console.debug('Creating instruction')
    const instruction = new TransactionInstruction({
      keys: [{ pubkey: this.publicKey!, isSigner: false, isWritable: true }],
      programId: this.programId!,
      data: Buffer.alloc(0)
    })
    console.debug('Creating transaction')
    const tx = new Transaction()
    tx.add(instruction)
    console.log('Sending transaction to the chain')
    const signature = await sendAndConfirmTransaction(
      this.connection,
      tx,
      [this.payerAccount!],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip'
      }
    )
    console.debug(`Got signature ${signature}`)
  }

  loadProgram = async (prog: ArrayBuffer) => {
    if (!this.programId) {
      console.log('Program ID not found, deploying')
      await this.createPayerAccount()
      console.log('Creating program account')
      const programAccount = new Account()
      console.log('Reading Buffer')
      console.log('Deploying')
      console.debug(
        `Payer account public key ${this.payerAccount!.publicKey.toBase58()}`
      )
      await BpfLoader.load(
        this.connection,
        this.payerAccount!,
        programAccount,
        Buffer.from(prog),
        BPF_LOADER_PROGRAM_ID
      )
      const storedProgramId = programAccount.publicKey.toBase58()
      console.log(`Program ID: ${storedProgramId}`)
      await localStorage.setItem('hello-world-prog-id', storedProgramId)
      this.programId = programAccount.publicKey
    }
    await this.createReceiverAccount()
  }

  createReceiverAccount = async () => {
    if (!this.payerAccount) {
      await this.createPayerAccount()
    }
    console.log('Creating receiver account')
    const account = new Account()
    this.publicKey = account.publicKey
    const space = greetedAccountDataLayout.span
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      greetedAccountDataLayout.span
    )
    console.log('building transaction')
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: this.payerAccount!.publicKey,
        newAccountPubkey: this.publicKey!,
        lamports,
        space,
        programId: this.programId!
      })
    )
    await localStorage.setItem(
      'hello-world-public-key',
      this.publicKey!.toBase58()
    )
    console.log('submitting account')
    await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [this.payerAccount!, account],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip'
      }
    )
    console.log('Success')
    console.log(`Receiver account public key ${this.publicKey!.toBase58()}`)
  }

  getKeys = () => {
    return {
      programId: this.programId ? this.programId.toBase58() : 'Undefined',
      publicKey: this.publicKey ? this.publicKey.toBase58() : 'Undefined',
      payerKey: this.payerAccount
        ? this.payerAccount.publicKey.toBase58()
        : 'Undefined'
    }
  }

  reset = () => {
    // @ts-ignore
    programId = null
    // @ts-ignore
    publicKey = null
    // @ts-ignore
    payerKey = null
  }
}

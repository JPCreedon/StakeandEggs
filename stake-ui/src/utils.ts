
import {
  Connection,
  PublicKey,
  Account, 
  SystemProgram,
  Transaction,
  // sendAndConfirmTransaction,
  // LAMPORTS_PER_SOL,
  TransactionInstruction,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
  SystemInstruction
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

// https://spl.solana.com/associated-token-account#creating-an-associated-token-account
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
)

const PROGRAM_ID = "8X2jRAZD25tSrGeEDaAmQXYY8Ki3uJBMBVgK4Dr2prcJ"
// const PROGRAM_ID = "8X2jRAZD25tSrGeEDaAmQXYY8Ki3uJBMBVgK4Dr2prcJ"
const STAKE_ACCOUNT = new PublicKey('F6gy4BtV5hRJJnHwr6ww2wMgyanGux8hhwBJugHPp9B3')

// Our stake PK and EGG_PRICE are here only for UI purposes. Additional check is performed on the chain
// in case a malicious user modifies that value
const OUR_PUBLIC_KEY = "4yvBtnpRJJGhspF3jj9bNtTo6tciJwoNjy1d7czVfguf"
// const OUR_PUBLIC_KEY = "FY56myChjwgbxVrpJy3G73wK1kqeZFo3MTQP2aRv8eNf"
const EGG_PRICE = 1 // TODO: change to 10
// const EGG_TOKEN = 'RzuWv9Dz9LwhTbkYrDM2uuZXEkb9KzFUw5iaWvmvPnH'
// const EGG_TOKEN = '8aR6gYQ9CM1ZFD6WhKeHCsje7kBnkwdpBu5Xj2NS711C'
const EGG_TOKEN = 'EBGbpNBfD2TSZi98VEMRhp9HAmFzhsPGUtN8dyHfZqdn'
// const CLUSTER_URL = 'http://devnet.solana.com'
const CLUSTER_URL = 'http://localhost:8899'
const STATE_ACCOUNT_SEED = 'egg-app-state-2'
const TOKEN_ACCOUNT_SEED = 'egg-app-token-account'
const MINT_AUTHORITY_SEED = "egg-app-mint-auth"

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}



export class Chain {
  connection: Connection
  programPublicKey: PublicKey
  ourPublicKey: PublicKey
  statePublicKey?: PublicKey
  encoder: TextEncoder
  
  constructor() {
    this.connection = new Connection(CLUSTER_URL)
    this.programPublicKey = new PublicKey(PROGRAM_ID)
    this.ourPublicKey = new PublicKey(OUR_PUBLIC_KEY)
    this.encoder = new TextEncoder()
  }

  private ensureStateAccountPublicKey = async () => {
    if (!this.statePublicKey) {
        let _:any;
        [this.statePublicKey, _] = await PublicKey.findProgramAddress(
          [Buffer.from(this.encoder.encode(STATE_ACCOUNT_SEED))], 
          this.programPublicKey)
        if (!this.statePublicKey) {
          throw new Error()
        }
      }
  }

  initApp = async (feePayerWallet: any) => {
    // let _:any;
    // [this.statePublicKey, _] = await PublicKey.findProgramAddress([Buffer.from(this.encoder.encode(STATE_ACCOUNT_SEED))], this.programPublicKey)
    // if (!this.statePublicKey) {
      // }
    await this.ensureStateAccountPublicKey()
    console.debug(`State account address is ${this.statePublicKey!.toBase58()}`)
    
    const instruction = new TransactionInstruction({
      keys:[
        {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        {pubkey: this.statePublicKey!, isSigner: false, isWritable: true},
        {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
        {pubkey: this.programPublicKey, isSigner: false, isWritable: false},
      ],
      programId: this.programPublicKey,
      data: Buffer.from(Uint8Array.of(0))

    })
    

    const t = new Transaction().add(instruction)
    
    let { blockhash } = await this.connection.getRecentBlockhash();
    t.recentBlockhash = blockhash;
    t.feePayer = feePayerWallet.publicKey;
    let signed_t = await feePayerWallet.signTransaction(t)
    
    const txid = await this.connection.sendRawTransaction(signed_t.serialize())
    console.log("TXID", txid)
    const sig = await this.connection.confirmTransaction(txid);
    console.log("Signature", sig)
  }
  
  
  transferToStakeAccount = async (wallet: any) => {
    await this.ensureStateAccountPublicKey()
    // let _: any
    const buy_egg = Buffer.from(Uint8Array.of(0)) 
    buy_egg[0] = 1
    
    const associatedAccount = new Account()
    
    // const associatedTokenAddress = await findAssociatedTokenAddress(wallet.publicKey, new PublicKey(EGG_TOKEN))
    const egg_account = new Account()
    const associatedTokenAddress = await findAssociatedTokenAddress(wallet.publicKey, egg_account.publicKey)
    // const userAssociatedAccount = await this.connection.getAccountInfo(associatedTokenAddress)
    // if (!userAssociatedAccount) {
    //   // user account does not exist, need to create it
      // const inst =  new TransactionInstruction({
      //   keys: [
      //     {pubkey: wallet.publicKey, isSigner: true, isWritable: true},
      //     {pubkey: associatedTokenAddress, isSigner:false, isWritable: true},
      //     {pubkey: wallet.publicKey, isSigner: true, isWritable: true},
      //     {pubkey: egg_account.publicKey, isSigner: false, isWritable: false},
      //     {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
      //     {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
      //     {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
      //   ],
      //   data: Buffer.from([]),
      //   programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      // })
    //   const tx = new Transaction().add(inst)
    //   tx.feePayer = wallet.publicKey
    //   let { blockhash } = await this.connection.getRecentBlockhash();
    //  // @ts-ignore
    //   tx.recentBlockhash = blockhash;
    //   let signed = await wallet.signTransaction(tx);
    //   let txid = await this.connection.sendRawTransaction(signed.serialize());
    //   await this.connection.confirmTransaction(txid);
    // }
    console.debug('-------------------------------------------------------')
    console.debug('-------------------------------------------------------')
    console.debug('-------------------------------------------------------')
    console.debug('-------------------------------------------------------')
    console.debug(await this.connection.getAccountInfo(associatedTokenAddress))
    console.debug('-------------------------------------------------------')
    console.debug('-------------------------------------------------------')
    const [mintAuthority, _] = await PublicKey.findProgramAddress([Buffer.from(this.encoder.encode(MINT_AUTHORITY_SEED))], new PublicKey(PROGRAM_ID))
    const mintAuthorityAccount = await this.connection.getAccountInfo(mintAuthority)
    
    const { epoch } = await this.connection.getEpochInfo('single')
    const seed = `${TOKEN_ACCOUNT_SEED}-${epoch}`;
    // const [egg_account, _] = await PublicKey.findProgramAddress([Buffer.from(this.encoder.encode(seed))], this.programPublicKey)
    const mintTokenAccount = new Account()
    console.debug(`MINT AUTHORITY PK: ${mintAuthority.toBase58()}`)
    // const egg_account = new Account()
    const keys = [
      {pubkey: wallet.publicKey, isSigner: true, isWritable: true},
      {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
      {pubkey: this.statePublicKey!, isSigner: false, isWritable: true},
      {pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false},
      {pubkey: this.programPublicKey, isSigner: false, isWritable: false},
      {pubkey: associatedAccount.publicKey, isSigner: true, isWritable: true},
      {pubkey: egg_account.publicKey, isSigner: true, isWritable: true},
      {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
      {pubkey: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, isSigner: false, isWritable: false},
      {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
      {pubkey: associatedTokenAddress, isSigner: false,   isWritable: true},
      {pubkey: mintTokenAccount.publicKey, isSigner: true, isWritable: true},
      {pubkey: mintAuthority, isSigner: false, isWritable: true}
    ]
    
    console.debug(`Egg account token ID: ${egg_account.publicKey.toBase58()}`)
    console.log("KEYS", keys)
    for (let i=0; i<keys.length; i++) {
        console.log(`${i}. ${keys[i].pubkey.toBase58()}`)
    }

    let transaction = new Transaction().add(
    //   SystemProgram.transfer({
    //      fromPubkey: wallet.publicKey,
    //      toPubkey: STAKE_ACCOUNT,
    //      lamports: EGG_PRICE * LAMPORTS_PER_SOL,
    //    })
    //  )
    //  .add(
       new TransactionInstruction({
         keys,
         programId: this.programPublicKey,
         data: buy_egg
       })
     )
 
     let { blockhash } = await this.connection.getRecentBlockhash();
     // @ts-ignore
     transaction.recentBlockhash = blockhash;
     transaction.feePayer = wallet.publicKey;
     transaction.partialSign(mintTokenAccount);
     transaction.partialSign(egg_account)
     transaction.partialSign(associatedAccount)
    //  @ts-ignore
    //  transaction.partialSign(mintAuthorityAccount)
     let signed = await wallet.signTransaction(transaction);
     let txid = await this.connection.sendRawTransaction(signed.serialize());
     await this.connection.confirmTransaction(txid);
  }

  // buyEgg = async (wallet:any) => {

  // }


  // private getAccountFromPrivateKey = (key: string): Account => {
  //   const decodedKey = key.replace(/[\[\]]/g, '').split(',').map(d=>parseInt(d))
  //   return new Account(decodedKey)
  // }

  

//   transferSOLFromUserAccount = async (publicKey: string, privateKey: string) => {
//     // const x = await this.connection.getAccountInfo(SystemProgram.programId)
//     // @ts-ignore
//     // x.publicKey = SystemProgram.programId
//     // Get user account
//     const account = this.getAccountFromPrivateKey(privateKey)
//     // Check balance
//     const balance = await this.connection.getBalance(account.publicKey) / LAMPORTS_PER_SOL
//     console.debug(`User balance is ${balance}`)

//     // Make sure we have at least 10 SOL
//     if (balance < EGG_PRICE) {
//       const err = `Insufficient balance ${balance}`
//       console.log(err)
//       return err
//     }

//     // const userEggAccount = new Account()
    
//     // Create a transaction to transfer
//     const t = new Transaction().add(
//       new TransactionInstruction({
//         keys: [
//           { pubkey: account.publicKey, isSigner: true, isWritable: true }, // user account
//           { pubkey: this.ourPublicKey, isSigner: false, isWritable: true}, // our stake account
//           { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},   // [0, 4, 6]
//           // { pubkey: userEggAccount.publicKey, isSigner: false, isWritable: true}, // [1]
//           // { pubkey: new PublicKey(publicKey), isSigner: false, isWritable: false}, // [2]
//           // { pubkey: new PublicKey(EGG_TOKEN), isSigner: false, isWritable: false}, // [3]
//           // { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false}, //[5]
//         ],
//         programId: this.programPublicKey,
//         data: Buffer.alloc(0)
//       })
//     )
//     // t.verifySignatures()
    
//     // const userEggAcountInfo = await SystemProgram.
//     // @ts-ignore
//     // userEggAcountInfo.publicKey = userEggAcountInfo.value?.owner
//     // console.log(userEggAcountInfo)
//     // const signature = await sendAndConfirmTransaction(
//     //   this.connection,
//     //   t,
//     //   [account],
//     //   {
//     //     // skipPreflight:true,
//     //     commitment: 'singleGossip',
//     //     preflightCommitment: 'singleGossip'
//     //   }
//     // )
//     // transaction.recentBlockhash = (
//     // const {blockhash} =  await this.connection.getRecentBlockhash()
//     // t.recentBlockhash = blockhash
//     // t.feePayer = account.publicKey
//     // t.partialSign(account)
    
//     const signature = await sendAndConfirmTransaction(
//       this.connection,
//       t,
//       [account],
//       {
//         // skipPreflight:true,
//         commitment: 'singleGossip',
//         preflightCommitment: 'singleGossip'
//       }
//     )
//     console.log(signature)
//   }
// }

// export const exchange = async (publickKey: string, privateKey: string) => {
//   const connection = new Connection(CLUSTER_URL)
//   // const userAccount
//   const decodedKey = privateKey.replace(/[\[\]]/g, '').split(',').map(d=>parseInt(d))
//   const account = new Account(decodedKey)
//   const b = await connection.getBalance(account.publicKey)
//   console.log(`Account balance ${b}`)
//   // Check that we have at least 10 SOL in the account, if not return error
//   if (b < 10) {
//     console.log('Not enough SOL')
//     return
//   }

//   // Transfer 10 SOLs to our account

  
// }

// export class Chain1 {
//   connection: Connection
//   account?: Account
//   programPublicKey: PublicKey
//   programAccount?: any
//   test: any
//   constructor() {
//     this.connection = new Connection(CLUSTER_URL)
//     this.programPublicKey = new PublicKey(PROGRAM_ID)
//     const z= new PublicKey('G7tao8oYuReh8CbVHgDWVi7k6XiFeuvCtWpA3cJtVCMj')
//     this.connection.onAccountChange(z, this.listener, 'singleGossip')
//     // this.programAccount = new Account() //this.getProgramAccount()
    
//   }
//   checkFunds = async (publicKey: string):Promise<number> => {
//     const pk = new PublicKey(publicKey)
//     return await this.connection.getBalance(pk)
//   }
//   listener = (keyedAccountInfo: any, context:any) => {
//     console.log(keyedAccountInfo)
//     console.log(context)
//     // keyedAccountInfo: KeyedAccountInfo,
//     // context: Context,
//   }
//   // getProgramAccount = () => {
//   //   return Promise.resolve(this.connection.getAccountInfo(this.programPublicKey)).then(async (pa) => {
//   //     this.programAccount = pa
//   //     this.createEmptyAccount()
//   //   })
//     // }
//   createEmptyAccount = async () => {
//     this.account = new Account()
//     this.programAccount = await this.connection.getAccountInfo(this.programPublicKey)
//     console.log(`PROGRAM PK ${this.programPublicKey}`)
//     console.log(`ACCOUNT PK ${this.account?.publicKey}`)
//     // this.programAccount = 


//     const a = new Account()
//     await this.connection.requestAirdrop(a.publicKey, 1000000);
//     let b = null
//     while (!b) {
//       b = await this.connection.getBalance(a.publicKey)
//       console.log(`BALANCE: ${b}`)
//       await sleep(1000)
//     }



//     const inst =  SystemProgram.createAccount({
//       fromPubkey: a.publicKey,
//       newAccountPubkey: this.account.publicKey,
//       lamports: 0,
//       space: 0,
//       programId: this.programPublicKey
//     })
//     const transaction = new Transaction().add(inst)

//     // const p = new PublicKey('8dqrzidas5B8aW6gERM5RQdAu4zajpvd8XiVJbBy4sTr')
//     // await this.connection.requestAirdrop(p, 0)
//     // this.test = await this.connection.getAccountInfo(p)
//     // console.log(this.test)
//     // this.test = await this.connection.getAccountInfo(this.account.publicKey)
//     // console.log(this.account.publicKey.toBase58())
//     // const transaction = new Transaction().add(
//     //   SystemProgram.createAccount({
//     //     fromPubkey: this.programPublicKey,
//     //     newAccountPubkey: this.account.publicKey,
//     //     lamports: 0,
//     //     space: 0,
//     //     programId: this.programPublicKey
//     //   })
//     // )

    

//     await sendAndConfirmTransaction(
//       this.connection,
//       transaction,
//       [a, this.account],
//       {
//         commitment: 'singleGossip',
//         preflightCommitment: 'singleGossip'
//       }
//     )
//   }

//   getAccount = ():String => {
//     return this.test?.publicKey.toBase58() || ''
//   }

}

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
      [
          walletAddress.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  ))[0];
}
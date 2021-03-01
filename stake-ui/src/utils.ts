// cspell: ignore sysvar lamports blockhash devnet txid
import {
  Connection,
  PublicKey,
  Account,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

// https://spl.solana.com/associated-token-account#creating-an-associated-token-account
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

// LOCAL CLUSTER
// const PROGRAM_ID = "8X2jRAZD25tSrGeEDaAmQXYY8Ki3uJBMBVgK4Dr2prcJ"
// const STAKE_ACCOUNT = new PublicKey('F6gy4BtV5hRJJnHwr6ww2wMgyanGux8hhwBJugHPp9B3')
// const CLUSTER_URL = 'http://0.0.0.0:8899'

// DEVNET
const PROGRAM_ID = '94qJGagpfsdWbPZewFj7CzzsFkjJfFJ56z8xE64X9DXL'
const STAKE_ACCOUNT = new PublicKey(
  '4yvBtnpRJJGhspF3jj9bNtTo6tciJwoNjy1d7czVfguf'
)
const CLUSTER_URL = 'http://devnet.solana.com'
// const PROGRAM_ID = "8X2jRAZD25tSrGeEDaAmQXYY8Ki3uJBMBVgK4Dr2prcJ"

const EGG_PRICE = 10 // TODO: change to 10

const OUR_PUBLIC_KEY = '4yvBtnpRJJGhspF3jj9bNtTo6tciJwoNjy1d7czVfguf' // TODO: remove

const STATE_ACCOUNT_SEED = 'egg-app-state-2'
const MINT_AUTHORITY_SEED = 'egg-app-mint-auth'

export class Chain {
  connection: Connection
  programPublicKey: PublicKey
  ourPublicKey: PublicKey // TODO: remove
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
      let _: any
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ;[this.statePublicKey, _] = await PublicKey.findProgramAddress(
        [Buffer.from(this.encoder.encode(STATE_ACCOUNT_SEED))],
        this.programPublicKey
      )
      if (!this.statePublicKey) {
        throw new Error()
      }
    }
  }

  initApp = async (feePayerWallet: any) => {
    await this.ensureStateAccountPublicKey()
    console.debug(`State account address is ${this.statePublicKey!.toBase58()}`)

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: this.statePublicKey!, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: this.programPublicKey, isSigner: false, isWritable: false }
      ],
      programId: this.programPublicKey,
      data: Buffer.from(Uint8Array.of(0))
    })

    const t = new Transaction().add(instruction)

    let { blockhash } = await this.connection.getRecentBlockhash()
    t.recentBlockhash = blockhash
    t.feePayer = feePayerWallet.publicKey
    let signed_t = await feePayerWallet.signTransaction(t)

    const txid = await this.connection.sendRawTransaction(signed_t.serialize())
    console.log('TXID', txid)
    const sig = await this.connection.confirmTransaction(txid)
    console.log('Signature', sig)
  }

  transferToStakeAccount = async (wallet: any) => {
    await this.ensureStateAccountPublicKey()
    const buy_egg = Buffer.from(Uint8Array.of(0))
    buy_egg[0] = 1

    const associatedAccount = new Account()

    const egg_account = new Account()
    const associatedTokenAddress = await findAssociatedTokenAddress(
      wallet.publicKey,
      egg_account.publicKey
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [mintAuthority, _] = await PublicKey.findProgramAddress(
      [Buffer.from(this.encoder.encode(MINT_AUTHORITY_SEED))],
      new PublicKey(PROGRAM_ID)
    )

    const mintTokenAccount = new Account()
    console.debug(`MINT AUTHORITY PK: ${mintAuthority.toBase58()}`)

    const keys = [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: this.statePublicKey!, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: this.programPublicKey, isSigner: false, isWritable: false },
      { pubkey: associatedAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: egg_account.publicKey, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      {
        pubkey: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        isSigner: false,
        isWritable: false
      },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
      { pubkey: mintTokenAccount.publicKey, isSigner: true, isWritable: true },
      { pubkey: mintAuthority, isSigner: false, isWritable: true }
    ]

    console.debug(`Egg account token ID: ${egg_account.publicKey.toBase58()}`)
    console.log('KEYS', keys)
    for (let i = 0; i < keys.length; i++) {
      console.log(`${i}. ${keys[i].pubkey.toBase58()}`)
    }

    let transaction = new Transaction()
      .add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: STAKE_ACCOUNT,
          lamports: EGG_PRICE * LAMPORTS_PER_SOL
        })
      )
      .add(
        new TransactionInstruction({
          keys,
          programId: this.programPublicKey,
          data: buy_egg
        })
      )

    let { blockhash } = await this.connection.getRecentBlockhash()
    // @ts-ignore
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey
    transaction.partialSign(mintTokenAccount)
    transaction.partialSign(egg_account)
    transaction.partialSign(associatedAccount)
    let signed = await wallet.signTransaction(transaction)
    let txid = await this.connection.sendRawTransaction(signed.serialize())
    await this.connection.confirmTransaction(txid)
  }
}

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer()
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]
}

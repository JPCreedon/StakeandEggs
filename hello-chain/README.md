<!-- cspell: ignore solana devnet -->
# Hello World Execution Counter UI

This is a playground to deploy and count executions of the hello world program

## Requirements: 
- NodeJS version 12.20.2

![Screenshot](./screenshot.png)
## Install
1. clone the repository
2. Run `yarn install ` install dependencies

## Build
1. `yarn build`

## Usage
1. Click on _choose file_ under _Load Program_ and select the compiled `.so` file under the `compiled` directory (untested, you might need to compile again the [Solana hello world example](https://github.com/solana-labs/example-helloworld). In that case, please use Rust). Hitting the _deploy_ button will deploy the program to Solana Devnet (hard-coded)
2. After completion, click on the _Say Hello_ button. It should increment the counter by 1 with every execution

**Notes:**
1. The first execution takes a bit longer since we need to create the payer account (persist until refresh)
2. We are polling the chain to get the account info every second so there is a slight delay.
3. The program ID and the receiver public key are stored in _LocalStorage_. To re-deploy the program, hit the _reset_ button
4. All accounts and transactions can be viewed in the [Solana explorer](https://explorer.solana.com/)

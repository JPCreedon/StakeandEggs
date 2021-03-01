// cspell:ignore sysvar
use solana_program::{
  account_info::{next_account_info, AccountInfo},
  clock::Clock,
  entrypoint::ProgramResult,
  msg,
  program::{invoke, invoke_signed},
  program_pack::Pack,
  pubkey::Pubkey,
  rent::Rent,
  system_instruction::{allocate, assign, create_account},
  sysvar::Sysvar,
};

use spl_token::instruction::{initialize_account, initialize_mint, mint_to};

use crate::{instructions::EggAppInstruction, state::EggApp};

const STATE_ACCOUNT_SEED: &[u8] = "egg-app-state-2".as_bytes();
const MINT_AUTHORITY_SEED: &[u8] = "egg-app-mint-auth".as_bytes();

pub struct Processor;

impl Processor {
  pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
  ) -> ProgramResult {
    msg!("Started processor");
    let instruction = EggAppInstruction::unpack(instruction_data)?;
    msg!("Executing instruction {:?}", instruction_data);

    match instruction {
      EggAppInstruction::InitApp {} => Self::init_app(accounts, program_id)?,
      EggAppInstruction::BuyEgg {} => Self::buy_egg(accounts, program_id)?,
    };

    Ok(())
  }

  fn init_app(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    // App initialization is to create a stake account
    msg!("Initializing...");
    let accounts_iter = &mut accounts.iter();

    // let fee_payer = next_account_info(accounts_iter)?;
    let system_account = next_account_info(accounts_iter)?;
    let state_account = next_account_info(accounts_iter)?;
    let clock_sysvar_info = next_account_info(accounts_iter)?;
    let our_program = next_account_info(accounts_iter)?;

    // Create the clock so we can get the epoch index
    let clock = &Clock::from_account_info(clock_sysvar_info)?;
    msg!("Epoch number {:?}", clock.epoch);

    // Get the state account public key
    let (state_account_pg, n) =
      match Pubkey::try_find_program_address(&[STATE_ACCOUNT_SEED], program_id) {
        Some(x) => x,
        None => {
          msg!("Could not get state_account_pg");
          panic!();
        }
      };

    msg!(
      "State account owned by program: {:?}",
      program_id == state_account.owner
    );

    // Change ownership of the account and allocate enough space for data
    if state_account.owner != program_id {
      let accounts = &[
        our_program.clone(),
        system_account.clone(),
        state_account.clone(),
      ];

      msg!("Allocating");
      let alloc_instruction = allocate(&state_account_pg, 9);
      invoke_signed(&alloc_instruction, accounts, &[&[STATE_ACCOUNT_SEED, &[n]]])?;

      msg!("Modifying owner");
      let owner_inst = assign(&state_account_pg, program_id);
      invoke_signed(&owner_inst, accounts, &[&[STATE_ACCOUNT_SEED, &[n]]])?;
    }

    // Create initial state
    let state = EggApp {
      is_initialized: true,
      current_epoch: clock.epoch,
    };

    // Write initial state to the state account
    EggApp::pack(state, &mut state_account.data.borrow_mut())?;
    msg!("Almost done");
    Ok(())
  }

  fn buy_egg(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
    msg!("Getting accounts");
    let accounts_iter = &mut accounts.iter();

    let fee_payer = next_account_info(accounts_iter)?;
    let system_account = next_account_info(accounts_iter)?;
    let _state_account = next_account_info(accounts_iter)?;
    let clock_sysvar_info = next_account_info(accounts_iter)?;
    let our_program = next_account_info(accounts_iter)?;
    let _associated_account = next_account_info(accounts_iter)?;
    let egg_token_account = next_account_info(accounts_iter)?;
    let _token_account = next_account_info(accounts_iter)?;
    let _spl_associated_token_account_prog = next_account_info(accounts_iter)?;
    let rent_account = next_account_info(accounts_iter)?;
    let _associated_token_account = next_account_info(accounts_iter)?;
    let mint_token_account = next_account_info(accounts_iter)?;
    let mint_authority_account = next_account_info(accounts_iter)?;

    let clock = &Clock::from_account_info(clock_sysvar_info)?;
    msg!("Epoch number {:?}", clock.epoch);

    // TODO: if epoch is different between clock in state, generate a new token
    // TODO: add current token to the state

    let (mint_authority, n) =
      match Pubkey::try_find_program_address(&[MINT_AUTHORITY_SEED], program_id) {
        Some(x) => x,
        None => {
          msg!("Could not get state_account_pg");
          panic!();
        }
      };

    msg!("Creating mint account");
    msg!("Rent exemption: {:?}", Rent::default().minimum_balance(82));
    let create_mint_account_inst = create_account(
      fee_payer.key,
      egg_token_account.key,
      Rent::default().minimum_balance(spl_token::state::Mint::LEN),
      spl_token::state::Mint::LEN as u64,
      &spl_token::id(),
    );
    invoke(
      &create_mint_account_inst,
      &[
        fee_payer.clone(),
        egg_token_account.clone(),
        our_program.clone(),
        system_account.clone(),
      ],
    )?;
    msg!("Mint account created successfully");

    msg!("Creating token account");
    msg!("Rent exemption: {:?}", Rent::default().minimum_balance(165));
    let create_token_account_inst = create_account(
      fee_payer.key,
      mint_token_account.key,
      Rent::default().minimum_balance(spl_token::state::Account::LEN),
      spl_token::state::Account::LEN as u64,
      &spl_token::id(),
    );

    invoke(
      &create_token_account_inst,
      &[
        fee_payer.clone(),
        mint_token_account.clone(),
        our_program.clone(),
        system_account.clone(),
      ],
    )?;
    msg!(
      "Token account created successfully {:?}",
      mint_token_account.key
    );

    msg!("Initializing mint account");
    let initialize_mint_inst = initialize_mint(
      &spl_token::id(),
      egg_token_account.key,
      &mint_authority,
      Some(program_id),
      0,
    )?;

    invoke(
      &initialize_mint_inst,
      &[egg_token_account.clone(), rent_account.clone()],
    )?;
    msg!("Mint account initialized successfully");

    msg!("Initializing token account");
    let initialize_account_inst = initialize_account(
      &spl_token::id(),
      mint_token_account.key,
      egg_token_account.key,
      &mint_authority,
    )?;

    invoke(
      &initialize_account_inst,
      &[
        mint_token_account.clone(),
        egg_token_account.clone(),
        rent_account.clone(),
        mint_authority_account.clone(),
      ],
    )?;
    msg!("token account initialized properly");

    // TODO: create associated account

    msg!("Minting a single token");
    let mint_inst = mint_to(
      &spl_token::id(),
      egg_token_account.key,
      mint_token_account.key,
      &mint_authority,
      &[&mint_authority],
      1,
    )?;

    invoke_signed(
      &mint_inst,
      &[
        egg_token_account.clone(),
        mint_token_account.clone(),
        mint_authority_account.clone(),
      ],
      &[&[MINT_AUTHORITY_SEED, &[n]]],
    )?;
    msg!("Minted successfully");
    Ok(())
  }
}

// cspell: ignore entrypoint pubkey
// #![cfg(not(feature = "no-entrypoint"))]

// use solana_program::{
//     account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
// };

// use transfer::process_instruction

// entrypoint!(process_instruction);
// fn process_instruction(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     instruction_data: &[u8],
// ) -> ProgramResult {
//     process_instruction(program_id, accounts, instruction_data)


// #![cfg(not(feature = "no-entrypoint"))]

use  crate::processor::Processor;


use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};

entrypoint!(process_instruction);
fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    Processor::process(program_id, accounts, instruction_data)
}
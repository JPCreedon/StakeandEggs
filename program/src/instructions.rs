use solana_program::program_error::ProgramError;

pub enum EggAppInstruction {
  InitApp{},
  BuyEgg{}
}

impl EggAppInstruction {
  pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
    let (tag, _) = input.split_first().ok_or(ProgramError::InvalidArgument)?;

    Ok(match tag {
      0 =>  Self::InitApp{},
      1 =>  Self::BuyEgg{},
      _ => return Err(ProgramError::InvalidArgument)
    })

  }
}
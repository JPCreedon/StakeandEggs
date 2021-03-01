// cspell: ignore arrayref
use solana_program::{
  program_error::ProgramError,
  program_pack::{IsInitialized, Pack, Sealed},
};

pub struct EggApp {
  pub is_initialized: bool,
  pub current_epoch: u64,
}

impl Sealed for EggApp {}

impl IsInitialized for EggApp {
  fn is_initialized(&self) -> bool {
    self.is_initialized
  }
}

impl Pack for EggApp {
  // packing order:
  //   1 (u8) is_initialized
  //   8 (u64) epoch number
  // Total of 41
  const LEN: usize = 9;
  fn pack_into_slice(&self, dst: &mut [u8]) {
    let dst = arrayref::array_mut_ref![dst, 0, EggApp::LEN];
    let (is_initialized_dst, current_epoch_dst) = arrayref::mut_array_refs![dst, 1, 8];
    let EggApp {
      is_initialized,
      current_epoch,
    } = self;

    is_initialized_dst[0] = *is_initialized as u8;
    *current_epoch_dst = current_epoch.to_le_bytes();
  }

  fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
    let src = arrayref::array_ref![src, 0, EggApp::LEN];
    let (is_initialized, current_epoch) = arrayref::array_refs![src, 1, 8];
    let is_initialized = match is_initialized {
      [0] => false,
      [1] => true,
      _ => return Err(ProgramError::AccountDataTooSmall),
    };
    Ok(EggApp {
      is_initialized,
      current_epoch: u64::from_le_bytes(*current_epoch),
    })
  }
}

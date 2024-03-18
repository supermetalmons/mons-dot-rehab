use anchor_lang::prelude::*;

declare_id!("FWMFXwhJvZzC6xq1rTdmTVYw9yMSY1T8LYwSMqRvyQ6A");

#[program]
pub mod mons_dot_rehab {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

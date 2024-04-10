use anchor_lang::prelude::*;

declare_id!("FWMFXwhJvZzC6xq1rTdmTVYw9yMSY1T8LYwSMqRvyQ6A");

#[program]
pub mod mons_dot_rehab {
    use super::*;

    const ENTRY_FEE: u64 = 42_000_000; // 0.042 SOL in lamports

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }

    pub fn create(ctx: Context<GameAction>, invite_id: String, player_id: String) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.invite_id = invite_id;
        game.player1 = player_id;
        game.balance += ENTRY_FEE;
        Ok(())
    }

    pub fn join(ctx: Context<GameAction>, invite_id: String, player_id: String) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.invite_id == invite_id, ErrorCode::InvalidInviteId);
        game.player2 = player_id;
        game.balance += ENTRY_FEE;
        Ok(())
    }

    pub fn resolve(ctx: Context<GameAction>, invite_id: String, winner_id: String) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.invite_id == invite_id, ErrorCode::InvalidInviteId);
        let winner = &ctx.accounts.winner;

        **winner.try_borrow_mut_lamports()? += game.balance;
        game.balance = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(invite_id: String, player_id: String)]
pub struct GameAction<'info> {
    #[account(init, payer = user, space = 8 + 256)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub winner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Game {
    pub invite_id: String,
    pub player1: String,
    pub player2: String,
    pub balance: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided invite ID does not match any game.")]
    InvalidInviteId,
}
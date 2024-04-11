use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;

declare_id!("23pPB7HdhdLukP8HxKSDoaSgrf6ESunhQMTCYm9DkJNp");

#[program]
pub mod mons_dot_rehab {
    use super::*;

    const GAME_COST: u64 = 42_000_000;

    pub fn create_game(ctx: Context<CreateGame>, game_id: u64) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.game_id = game_id;
        game.host_id = ctx.accounts.host.key();
        game.guest_id = Pubkey::default();

        let transfer_instruction = system_instruction::transfer(
            ctx.accounts.host.to_account_info().key,
            ctx.accounts.game.to_account_info().key,
            GAME_COST,
        );
        invoke(
            &transfer_instruction,
            &[
                ctx.accounts.host.to_account_info(),
                ctx.accounts.game.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>, game_id: u64) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.game_id == game_id, ErrorCode::GameNotFound);
        require!(game.guest_id == Pubkey::default(), ErrorCode::GameAlreadyJoined);
    
        game.guest_id = ctx.accounts.guest.key();
    
        let transfer_instruction = system_instruction::transfer(
            ctx.accounts.guest.to_account_info().key,
            ctx.accounts.game.to_account_info().key,
            GAME_COST,
        );
        invoke(
            &transfer_instruction,
            &[
                ctx.accounts.guest.to_account_info(),
                ctx.accounts.game.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
    
        Ok(())
    }

    pub fn resolve_game(ctx: Context<ResolveGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let caller = ctx.accounts.caller.key();

        require!(caller == game.host_id || caller == game.guest_id, ErrorCode::Unauthorized);

        let game_lamports = ctx.accounts.game.to_account_info().lamports();
        require!(game_lamports >= 2 * GAME_COST, ErrorCode::GameAlreadyResolvedOrInsufficientFunds);

        **ctx.accounts.caller.to_account_info().try_borrow_mut_lamports()? = ctx.accounts.caller.to_account_info().lamports().checked_add(2 * GAME_COST).ok_or(ErrorCode::AmountOverflow)?;
        **ctx.accounts.game.to_account_info().try_borrow_mut_lamports()? = ctx.accounts.game.to_account_info().lamports().checked_sub(2 * GAME_COST).ok_or(ErrorCode::AmountOverflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct CreateGame<'info> {
    #[account(init, payer = host, space = 1 + 8 + 8 + 32 + 32, seeds = [b"game", &game_id.to_le_bytes()[..]], bump)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub host: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Game {
    pub game_id: u64,
    pub host_id: Pubkey,
    pub guest_id: Pubkey,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut, seeds = [b"game", &game.game_id.to_le_bytes()[..]], bump)]
    pub game: Account<'info, Game>,
    pub guest: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveGame<'info> {
    #[account(mut, seeds = [b"game", &game.game_id.to_le_bytes()[..]], bump, close = caller)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub caller: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The specified game was not found.")]
    GameNotFound,
    #[msg("This game has already been joined.")]
    GameAlreadyJoined,
    #[msg("The game has already been resolved or has insufficient funds.")]
    GameAlreadyResolvedOrInsufficientFunds,
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Amount overflow.")]
    AmountOverflow,
}
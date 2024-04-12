// Here we export some useful types and functions for interacting with the Anchor program.
import { PublicKey } from '@solana/web3.js';
import type { MonsDotRehab } from '../target/types/mons_dot_rehab';
import { IDL as MonsDotRehabIDL } from '../target/types/mons_dot_rehab';

// Re-export the generated IDL and type
export { MonsDotRehab, MonsDotRehabIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const programId = new PublicKey(
  '3kE4wupk4Y1JcoRVA5o9dD4tCn95D6VLevHvot4pj81B'
);

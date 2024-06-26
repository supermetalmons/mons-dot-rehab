import { programId, MonsDotRehabIDL } from '@mons-dot-rehab/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, PublicKey, sendAndConfirmRawTransaction } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { Buffer } from 'buffer';
import BN from 'bn.js';

export function useMonsDotRehabProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const program = new Program(MonsDotRehabIDL, programId, provider);

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createGame = useMutation({
    mutationKey: ['monsDotRehab', 'createGame', { cluster }],
    mutationFn: async (gameIdString: string) => {
      const gameID = convertBase62StringToBN(gameIdString);
      const gamePDA = await findGamePDA(gameIdString);
      return program.rpc.createGame(new BN(gameID), {
        accounts: {
          game: gamePDA,
          host: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [],
      });
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Game created successfully!');
    },
    onError: (error) => toast.error(`Failed to create game: ${error.message}`),
  });

  const joinGame = useMutation({
    mutationKey: ['monsDotRehab', 'joinGame', { cluster }],
    mutationFn: async (gameIdString: string) => {
      const gameID = convertBase62StringToBN(gameIdString);
      const seeds = [Buffer.from('game'), Buffer.from(new BN(gameID).toArrayLike(Buffer, 'le', 8))];
      const [gamePDA, bump] = await PublicKey.findProgramAddress(seeds, program.programId);
      return program.rpc.joinGame(new BN(gameID), {
        accounts: {
          game: gamePDA,
          guest: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [],
      });
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Game joined successfully!');
    },
    onError: (error) => toast.error(`Failed to join game: ${error.message}`),
  });

  const endGame = useMutation({
    mutationKey: ['monsDotRehab', 'endGame', { cluster }],
    
    mutationFn: async (serializedTransactionBase64: string) => {
      const serializedTransactionBuffer = Buffer.from(serializedTransactionBase64, 'base64');
      const transaction = Transaction.from(serializedTransactionBuffer);
      const signedTransaction = await provider.wallet.signTransaction(transaction);
      const serializedTransaction = signedTransaction.serialize({ requireAllSignatures: true });
      return sendAndConfirmRawTransaction(connection, serializedTransaction);
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      toast.success('Game resolved successfully!');
    },
    onError: (error) => toast.error(`Failed to resolve game: ${error.message}`),
  });
  
  return {
    program,
    programId,
    createGame,
    joinGame,
    getProgramAccount,
    endGame,
  };
}

export async function findGamePDA(str: string): Promise<PublicKey> {
  const gameID = convertBase62StringToBN(str);
  const seeds = [Buffer.from('game'), Buffer.from(new BN(gameID).toArrayLike(Buffer, 'le', 8))];
  const [gamePDA, _] = await PublicKey.findProgramAddress(seeds, programId);
  return gamePDA
}

function convertBase62StringToBN(str: string) {
  const base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = new BN(0);

  for (let char of str) {
      const value = base62.indexOf(char);
      if (value === -1) {
          throw new Error(`Invalid character in string: ${char}`);
      }
      result = result.mul(new BN(62)).add(new BN(value));
  }

  return result;
}
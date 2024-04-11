import { programId, MonsDotRehabIDL } from '@mons-dot-rehab/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, PublicKey } from '@solana/web3.js';
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
    mutationFn: async () => {
      const gameID = Math.floor(Math.random() * 1000000); // TODO: use actual id
      const seeds = [Buffer.from('game'), Buffer.from(new BN(gameID).toArrayLike(Buffer, 'le', 8))];
      const [gamePDA, bump] = await PublicKey.findProgramAddress(seeds, program.programId);
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
    mutationFn: async () => {
      const gameID = Math.floor(Math.random() * 1000000); // TODO: use actual id
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
  
  return {
    program,
    programId,
    createGame,
    joinGame,
    getProgramAccount,
  };
}

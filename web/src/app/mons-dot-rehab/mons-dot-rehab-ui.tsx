import { Keypair } from '@solana/web3.js';
import { useMonsDotRehabProgram } from './mons-dot-rehab-data-access';

export function MonsDotRehabCreate() {
  const { createGame } = useMonsDotRehabProgram();

  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => createGame.mutateAsync()}
      disabled={createGame.isPending}
    >
      run{createGame.isPending && '...'}
    </button>
  );
}

export function MonsDotRehabProgram() {
  const { getProgramAccount } = useMonsDotRehabProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-warning flex justify-center">
        <span>
          program account not found
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      <pre>{JSON.stringify(getProgramAccount.data.value, null, 2)}</pre>
    </div>
  );
}

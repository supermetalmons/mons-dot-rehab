import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useMonsDotRehabProgram } from './mons-dot-rehab-data-access';
import { MonsDotRehabCreate, MonsDotRehabProgram } from './mons-dot-rehab-ui';

export default function MonsDotRehabFeature() {
  const { publicKey } = useWallet();
  const { programId } = useMonsDotRehabProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="MonsDotRehab"
        subtitle={'Run the program by clicking the "Run program" button.'}
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <MonsDotRehabCreate />
      </AppHero>
      <MonsDotRehabProgram />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}

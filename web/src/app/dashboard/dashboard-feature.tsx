import { AppHero } from '../ui/ui-layout';

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="mons" subtitle="wip">
        <a href="https://mons.rehab/app-request?type=createSecretInvite" target="_blank" rel="noopener noreferrer">
          <button className="btn btn-primary">new match</button>
        </a>
      </AppHero>
    </div>
  );
}
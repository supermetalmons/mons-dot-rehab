import { AppHero } from '../ui/ui-layout';
import { useLocation } from 'react-router-dom';

export default function DashboardFeature() {
  const location = useLocation();
  const fullQuery = location.search;

  return (
    <div>
      <AppHero title="mons" subtitle="wip">
        <a href={`https://mons.rehab/app-request?type=createSecretInvite`} target="_blank" rel="noopener noreferrer">
          <button className="btn btn-primary">new match</button>
        </a>
        <p><br />{fullQuery}</p>
      </AppHero>
    </div>
  );
}
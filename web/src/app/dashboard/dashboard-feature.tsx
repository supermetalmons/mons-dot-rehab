import { AppHero } from '../ui/ui-layout';
import { useLocation } from 'react-router-dom';
import { useState } from 'react'; // Added import for useState

export default function DashboardFeature() {
  const location = useLocation();
  const fullQuery = location.search;

  const [pageTitle, setPageTitle] = useState("mons");

  const changePageTitle = () => {
    const newTitle = "redirect";
    document.title = newTitle;
    setPageTitle(newTitle);
    window.location.href = `supermons://?type=createSecretInvite`;
  };

  return (
    <div>
      <AppHero title={pageTitle} subtitle="wip">
        <button className="btn btn-primary" onClick={changePageTitle}>new match</button>
        <p><br />{fullQuery}</p>
      </AppHero>
    </div>
  );
}
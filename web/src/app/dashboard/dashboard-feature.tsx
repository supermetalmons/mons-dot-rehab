import { AppHero } from '../ui/ui-layout';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function DashboardFeature() {
  const location = useLocation();
  const fullQuery = location.search;

  const [pageTitle, setPageTitle] = useState("mons");
  const [subtitle, setSubtitle] = useState("🥱");
  const [heroBgColor, setHeroBgColor] = useState("");

  const changePageTitleAndBgColor = () => {
    const newTitle = "redirected";
    document.title = newTitle;
    setPageTitle(newTitle);
    setHeroBgColor("green");
    setSubtitle("make sure you have mons app installed");
    window.location.href = `supermons://?type=createSecretInvite`;
  };

  return (
    <div style={{backgroundColor: heroBgColor}}>
      <AppHero title={pageTitle} subtitle={subtitle}>
        <button className="btn btn-primary" onClick={changePageTitleAndBgColor}>new match</button>
        <p><br />{fullQuery}</p>
      </AppHero>
    </div>
  );
}
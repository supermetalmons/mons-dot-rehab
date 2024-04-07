import { AppHero } from '../ui/ui-layout';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';

export default function DashboardFeature() {
  const location = useLocation();
  const fullQuery = location.search;
  const { publicKey } = useWallet();

  const [pageTitle, setPageTitle] = useState("mons");
  const [subtitle, setSubtitle] = useState("🥱");
  const [heroBgColor, setHeroBgColor] = useState("");
  const [redirectCount, setRedirectCount] = useState(0);

  const handleRedirect = () => {
    if (redirectCount === 0) {
      const newTitle = "redirected";
      document.title = newTitle;
      setPageTitle(newTitle);
      setHeroBgColor("green");
      setSubtitle("make sure you have mons app installed");
      window.location.href = `supermons://?type=createSecretInvite`;
      setRedirectCount(1);
    } else {
      window.location.href = "https://mons.link";
    }
  };

  return publicKey ? (
    <div style={{backgroundColor: heroBgColor}}>
      <AppHero title={pageTitle} subtitle={subtitle}>
        <button className="btn btn-primary" onClick={handleRedirect}>{redirectCount === 0 ? "new match" : "get mons app"}</button>
        <p><br />{fullQuery}</p>
      </AppHero>
    </div>
  ) : (
    <div style={{backgroundColor: heroBgColor}}>
      <AppHero title={pageTitle} subtitle={subtitle}>
        <WalletButton />
      </AppHero>
    </div>
  );
}


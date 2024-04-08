import { AppHero } from '../ui/ui-layout';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';

export default function DashboardFeature() {
  const location = useLocation();
  const queryString = location.search.substring(1);
  const queryPairs = queryString.split("&").reduce<Record<string, string>>((acc, pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {});

  const { publicKey } = useWallet();

  const [pageTitle, setPageTitle] = useState("mons");
  const [subtitle, setSubtitle] = useState("🥱");
  const [buttonTitle, setButtonTitle] = useState("");
  const [heroBgColor, setHeroBgColor] = useState("");
  const [redirectCount, setRedirectCount] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    switch (queryPairs["type"]) {
      case "createSecretInvite":
        setPageTitle("create onchain match");
        setSubtitle("🪙");
        setButtonTitle("0.042 sol");
        break;
      case "acceptSecretInvite":
        setPageTitle("join onchain match");
        setSubtitle("🪙");
        setButtonTitle("0.042 sol");
        break;
      default:
        setIsButtonDisabled(false);
        setIsLoading(false);
        setPageTitle(redirectCount === 0 ? "mons" : "redirected");
        setSubtitle(redirectCount === 0 ? "🥱" : "make sure you have mons app installed");
        setButtonTitle(redirectCount === 0 ? "new match" : "get mons app");
        break;
    }
  }, [queryPairs, redirectCount]);

  const handleRedirect = () => {
    if (redirectCount != 0) {
      window.location.href = "https://mons.link";
      return;
    } else if (queryPairs["type"] === "createSecretInvite") {
      setIsButtonDisabled(true);
      setIsLoading(true);
      // TODO: create onchain match tx
      return;
    } else if (queryPairs["type"] === "acceptSecretInvite") {
      return;
    } else {
      const newTitle = "🟩 redirected";
      document.title = newTitle;
      setHeroBgColor("green");
      window.location.href = `supermons://?type=createSecretInvite`;
      setRedirectCount(1);
    }
  };

  return publicKey ? (
    <div style={{backgroundColor: heroBgColor}}>
      <AppHero title={pageTitle} subtitle={subtitle}>
        <button className="btn btn-primary" onClick={handleRedirect} disabled={isButtonDisabled}>
          {isLoading ? <span>processing...</span> : buttonTitle}
        </button>
        <div>
        <p><br /></p>
        {isLoading && <span className="loading loading-spinner"></span>}
        <p><br /></p>
          {Object.entries(queryPairs).map(([key, value]) => (
            <p key={key}>{`${key} ~ ${value}`}<br /><br /></p>
          ))}
        </div>
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


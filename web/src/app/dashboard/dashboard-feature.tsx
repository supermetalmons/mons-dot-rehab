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
  const [isWaitingForInviteToBeShared, setIsWaitingForInviteToBeShared] = useState(false);
  const [isWaitingForSomeoneToJoin, setIsWaitingForSomeoneToJoin] = useState(false);
  const [someoneJustJoined, setSomeoneJustJoined] = useState(false);
  const [wentToPlay, setWentToPlay] = useState(false);

  useEffect(() => {
    switch (queryPairs["type"]) {
      case "createSecretInvite":
        if (isWaitingForInviteToBeShared) {
          if (wentToPlay) {
            setPageTitle("playing");
            setSubtitle("🏁");
            setButtonTitle("get match result");
          } else if (someoneJustJoined) {
            setPageTitle("ready to play");
            setSubtitle("😼");
            setButtonTitle("go");
            setIsLoading(false);
          } else if (isWaitingForSomeoneToJoin) {
            setPageTitle("waiting for a match");
            setSubtitle("🫖");
            setButtonTitle("copy invite link");
          } else {
            setPageTitle("onchain match created");
            setSubtitle("👇");
            setButtonTitle("copy invite link");
          }
        } else {
          setPageTitle("create onchain match");
          setSubtitle("🪙");
          setButtonTitle("0.042 sol");
        }
        break;
      case "acceptSecretInvite":
        setPageTitle("join onchain match");
        setSubtitle("🪙");
        setButtonTitle("0.042 sol");
        break;
      case "getSecretGameResult":
        if (queryPairs["result"] === "draw") {
          setPageTitle("it's a draw!");
          setSubtitle("🤝");
          setButtonTitle("split prize");
        } else if (!queryPairs["result"]) {
          setPageTitle("playing");
          setSubtitle("🏁");
          setButtonTitle("get match result");
        } else {
          setPageTitle("you won / you lost"); // TODO: check id queryPairs["result"]
          setSubtitle(`🏅`);
          setButtonTitle("gg");
        }
        break;
      default:
        setWentToPlay(false);
        setSomeoneJustJoined(false);
        setIsWaitingForSomeoneToJoin(false);
        setIsWaitingForInviteToBeShared(false);
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
      if (wentToPlay) {
        window.location.href = `supermons://app-request?type=getSecretGameResult&id=${encodeURIComponent(queryPairs["id"])}&signature=ed25519`;
      } else if (someoneJustJoined) {
        window.location.href = `supermons://?play=${encodeURIComponent(queryPairs["id"])}`;
        setWentToPlay(true);
      } else if (isWaitingForInviteToBeShared) {
        const customUrl = `https://mons.link/invite?code=${encodeURIComponent('your-invite-code')}`; // TODO: correct url to share
        navigator.clipboard.writeText(customUrl);
        if (!isWaitingForSomeoneToJoin) {
          setIsWaitingForSomeoneToJoin(true);
          setIsLoading(true);
          setTimeout(() => {
            // TODO: actually monitor invite status
            setSomeoneJustJoined(true);
          }, 7000);
        }
      } else {
        setIsButtonDisabled(true);
        setIsLoading(true);
        setTimeout(() => {
          setIsWaitingForInviteToBeShared(true);
          setIsButtonDisabled(false);
          setIsLoading(false);
        }, 5000);
      }
      // TODO: create onchain match tx
      return;
    } else if (queryPairs["type"] === "acceptSecretInvite") {
      // TODO: accept secret invite
      return;
    } else if (queryPairs["type"] === "getSecretGameResult") {
      if (queryPairs["result"] === "draw") {
        // TODO: split tx
      } else if (!queryPairs["result"]) {
        window.location.href = `supermons://app-request?type=getSecretGameResult&id=${encodeURIComponent(queryPairs["id"])}&signature=ed25519`;
      } else {
        // TODO: claim prize tx or leave
      }
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
        {!someoneJustJoined && isWaitingForInviteToBeShared && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input value={`〖 secret invite link 〗`} readOnly style={{ textAlign: 'center' }} />
            </div>
            <p><br /></p>
          </div>
        )}
        <button className="btn btn-primary" onClick={handleRedirect} disabled={isButtonDisabled}>
          {isLoading && isButtonDisabled ? <span>processing...</span> : buttonTitle}
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


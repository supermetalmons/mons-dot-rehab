import { AppHero } from '../ui/ui-layout';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { useMonsDotRehabProgram } from '../mons-dot-rehab/mons-dot-rehab-data-access';
import { Keypair } from '@solana/web3.js';

export default function DashboardFeature() {
  const { createGame, joinGame, resolveGame } = useMonsDotRehabProgram();
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
  const [didSendFinalTx, setDidSendFinalTx] = useState(false);

  useEffect(() => {
    switch (queryPairs["type"]) {
      case "createSecretInvite":
        if (redirectCount != 0) {
          setPageTitle("redirected");
          setSubtitle("make sure you have mons app installed");
          setButtonTitle("get mons app");
        } else if (isWaitingForInviteToBeShared) {
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
            setSubtitle("🐣");
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
        if (redirectCount != 0) {
          setPageTitle("redirected");
          setSubtitle("make sure you have mons app installed");
          setButtonTitle("get mons app");
        } else if (wentToPlay) {
          setPageTitle("playing");
          setSubtitle("🏁");
          setButtonTitle("get match result");
        } else if (someoneJustJoined) {
          setPageTitle("ready to play");
          setSubtitle("😼");
          setButtonTitle("go");
          setIsLoading(false);
        } else if (!queryPairs["guestId"]) {
          setPageTitle("play mons");
          setSubtitle("🥱");
          setButtonTitle("join");
        } else {
          setPageTitle("join onchain match");
          setSubtitle("🪙");
          setButtonTitle("0.042 sol");
        }
        break;
      case "getSecretGameResult":
        if (redirectCount != 0) {
          setPageTitle("redirected");
          setSubtitle("make sure you have mons app installed");
          setButtonTitle("get mons app");
        } else if (didSendFinalTx) {
          setPageTitle("all done");
          setSubtitle("✅");
          setButtonTitle("ok");
        } else if (queryPairs["result"] === "draw") {
          setPageTitle("it's a draw!");
          setSubtitle("🤝");
          setButtonTitle("split prize");
        } else if (queryPairs["result"] === "none" || !queryPairs["result"]) {
          setPageTitle("playing");
          setSubtitle("🏁");
          setButtonTitle("get match result");
        } else if (queryPairs["result"] === "win") {
          setPageTitle("you won");
          setSubtitle(`🏅`);
          setButtonTitle("claim prize");
        } else if (queryPairs["result"] === "gg") {
          setPageTitle("gg");
          setSubtitle(`🥈`);
          setButtonTitle("ok"); 
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
        didRedirect();
        window.location.href = `supermons://app-request?type=getSecretGameResult&id=${encodeURIComponent(queryPairs["id"])}&signature=ed25519`;
      } else if (someoneJustJoined) {
        window.location.href = `supermons://?play=${encodeURIComponent(queryPairs["id"])}`;
        setWentToPlay(true);
      } else if (isWaitingForInviteToBeShared) {
        const customUrl = `https://mons.rehab/open-in-browser?id=${encodeURIComponent(queryPairs["id"])}&password=${encodeURIComponent(queryPairs["password"])}&hostId=${encodeURIComponent(queryPairs["hostId"])}&hostColor=${encodeURIComponent(queryPairs["hostColor"])}&type=acceptSecretInvite`;
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
        createGame.mutateAsync(queryPairs["id"]).then(result => {
          setIsWaitingForInviteToBeShared(true);
          setIsButtonDisabled(false);
          setIsLoading(false);
        }).catch(error => {
          setIsButtonDisabled(false);
          setIsLoading(false);
        });
      }
      return;
    } else if (queryPairs["type"] === "acceptSecretInvite") {
      if (wentToPlay) {
        didRedirect();
        window.location.href = `supermons://app-request?type=getSecretGameResult&id=${encodeURIComponent(queryPairs["id"])}&signature=ed25519`;
      } else if (someoneJustJoined) {
        window.location.href = `supermons://?play=${encodeURIComponent(queryPairs["id"])}`;
        setWentToPlay(true);
      } else if (!queryPairs["guestId"]) {
        didRedirect();
        const guestIdRedirect = `supermons://app-request?${queryString}`;
        window.location.href = guestIdRedirect;
      } else if (!someoneJustJoined) {
        setIsButtonDisabled(true);
        setIsLoading(true);
        joinGame.mutateAsync(queryPairs["id"]).then(result => {
          setSomeoneJustJoined(true);
          setIsButtonDisabled(false);
          setIsLoading(false);
        }).catch(error => {
          setIsButtonDisabled(false);
          setIsLoading(false);
        });
      }
      return;
    } else if (queryPairs["type"] === "getSecretGameResult") {
      if (didSendFinalTx) {
        window.location.href = "https://mons.rehab";
      } else if (queryPairs["result"] === "draw") {
        setIsButtonDisabled(true);
        setIsLoading(true);
        resolveGame.mutateAsync(queryPairs["id"]).then(result => {
          setIsButtonDisabled(false);
          setIsLoading(false);
          setDidSendFinalTx(true);
        }).catch(error => {
          setIsButtonDisabled(false);
          setIsLoading(false);
        });
      } else if (queryPairs["result"] === "none" || !queryPairs["result"]) {
        didRedirect();
        window.location.href = `supermons://app-request?type=getSecretGameResult&id=${encodeURIComponent(queryPairs["id"])}&signature=ed25519`;
      } else if (queryPairs["result"] === "gg") {
        window.location.href = "https://mons.rehab";
      } else if (queryPairs["result"] === "win") {
        setIsButtonDisabled(true);
        setIsLoading(true);
        resolveGame.mutateAsync(queryPairs["id"]).then(result => {
          setIsButtonDisabled(false);
          setIsLoading(false);
          setDidSendFinalTx(true);
        }).catch(error => {
          setIsButtonDisabled(false);
          setIsLoading(false);
        });
      }
      return;
    } else {
      didRedirect();
      window.location.href = `supermons://?type=createSecretInvite`;
    }
  };

  function didRedirect() {
    const newTitle = "🟩 redirected";
    document.title = newTitle;
    setHeroBgColor("#65ED5A");
    setRedirectCount(1);
  }

  return publicKey ? (
    <div style={{backgroundColor: heroBgColor, borderRadius: '15px'}}>
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
        {redirectCount == 0 && queryPairs["type"] === "getSecretGameResult" && (queryPairs["result"] === "none" || !queryPairs["result"]) && (
          <button className="btn btn-primary" onClick={() => {window.location.href = `supermons://?play=${encodeURIComponent(queryPairs["id"])}`;}}>
            {'back to game'}
          </button>
        )}
        {isLoading && <span className="loading loading-spinner"></span>}
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


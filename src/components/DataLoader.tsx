import { useEffect, useRef, useState } from "react";

const MINIMUM_VISIBLE_TIME_MS = 250;

export default function DataLoader() {
  const [visible, setVisible] = useState(false);
  const pendingRequests = useRef(0);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const show = () => {
      pendingRequests.current += 1;
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      setVisible(true);
    };

    const hide = () => {
      pendingRequests.current = Math.max(0, pendingRequests.current - 1);
      if (pendingRequests.current > 0) return;
      hideTimer.current = window.setTimeout(() => {
        setVisible(false);
        hideTimer.current = null;
      }, MINIMUM_VISIBLE_TIME_MS);
    };

    window.addEventListener("sgrh:request-start", show);
    window.addEventListener("sgrh:request-end", hide);
    return () => {
      window.removeEventListener("sgrh:request-start", show);
      window.removeEventListener("sgrh:request-end", hide);
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="app-loader" role="progressbar" aria-label="Chargement des données">
      <span className="app-loader__bar" aria-hidden="true" />
    </div>
  );
}

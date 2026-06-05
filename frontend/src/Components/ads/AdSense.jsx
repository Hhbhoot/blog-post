import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { ADSENSE_CLIENT } from '../../config/ads';

// Singleton loader promise so we never inject the script more than once
let adsenseLoaderPromise = null;

function loadAdsenseScript() {
  if (typeof window === 'undefined')
    return Promise.reject(new Error('No window'));
  if (adsenseLoaderPromise) return adsenseLoaderPromise;

  adsenseLoaderPromise = new Promise((resolve, reject) => {
    // Prevent duplicate script tags or duplicate loads when the script is included in index.html.
    if (
      document.querySelector('script[data-adsense-loader]') ||
      document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
    ) {
      // wait a tick for global object
      return resolve();
    }

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-adsense-loader', '1');

    // If a client id is provided, include it in the querystring so AdSense
    // associates the requests with your publisher account.
    const clientQuery = ADSENSE_CLIENT
      ? `?client=${encodeURIComponent(ADSENSE_CLIENT)}`
      : '';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js${clientQuery}`;

    script.onload = () => {
      // some AdSense setups expect a global
      resolve();
    };
    script.onerror = () => reject(new Error('AdSense script failed to load'));

    document.head.appendChild(script);
  });

  return adsenseLoaderPromise;
}

// Reusable AdSense component
// Accepts adSlot, adFormat, style, className
const AdSense = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
  onError,
}) => {
  const ref = useRef(null);
  const location = useLocation();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    // If the script fails to load, we surface the error so parent can show placeholder
    loadAdsenseScript()
      .then(() => {
        if (!mounted) return;
        try {
          // Ensure adsbygoogle array exists and request a new ad slot render
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          setFailed(true);
          if (onError) onError(err);
        }
      })
      .catch((err) => {
        setFailed(true);
        if (onError) onError(err);
      });

    return () => {
      mounted = false;
    };
    // Re-run when route changes so ads can re-initialize on client navigation
  }, [location.pathname, onError]);

  // If script failed, bubble up via children
  if (failed) return null;

  // AdSense uses a specific ins element and global call to render ads.
  // We provide common attributes but the application should supply valid
  // adSlot values from their AdSense account when enabling ads.
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={ADSENSE_CLIENT || undefined}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      ref={ref}
    />
  );
};

export default AdSense;

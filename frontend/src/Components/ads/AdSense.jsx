import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import {
  ADSENSE_CLIENT,
  ADSENSE_SLOT,
  ADSENSE_LAYOUT_KEY,
  ADSENSE_FORMAT,
  ADSENSE_TEST_MODE,
} from '../../config/ads';

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
      document.querySelector(
        'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
      )
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
// Accepts adSlot, adFormat, adLayoutKey, style, className
const AdSense = ({
  adSlot = ADSENSE_SLOT,
  adFormat = ADSENSE_FORMAT || 'auto',
  adLayoutKey = ADSENSE_LAYOUT_KEY,
  style = {},
  className = '',
  onError,
}) => {
  const ref = useRef(null);
  const location = useLocation();
  const [failed, setFailed] = useState(false);
  const initializedRef = useRef(false);

  const mergedStyle = {
    display: 'block',
    width: '100%',
    minWidth: '250px',
    ...style,
  };

  useEffect(() => {
    let mounted = true;
    let timerId = null;
    let observer = null;
    let intervalId = null;

    // If this component instance has already triggered push, don't do it again
    if (initializedRef.current) return;

    loadAdsenseScript()
      .then(() => {
        if (!mounted || initializedRef.current) return;

        const insElement = ref.current;
        if (!insElement) return;

        // If the script already initialized this DOM element, mark initialized and exit
        if (insElement.getAttribute('data-adsbygoogle-status') === 'done') {
          initializedRef.current = true;
          return;
        }

        const checkAndPush = () => {
          if (!mounted || initializedRef.current) return false;

          // Compute actual available layout width
          const width =
            insElement.offsetWidth ||
            (insElement.parentElement
              ? insElement.parentElement.offsetWidth
              : 0);

          if (width >= 250) {
            try {
              initializedRef.current = true;
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              return true; // Successfully pushed
            } catch (err) {
              console.error('AdSense push error:', err);
              setFailed(true);
              if (onError) onError(err);
              return true; // Stop observing/trying on error
            }
          }
          return false; // Not wide enough yet
        };

        // Delay checking to allow initial render paint and layout computation
        timerId = setTimeout(() => {
          if (!mounted || initializedRef.current) return;

          if (checkAndPush()) {
            return;
          }

          // If not wide enough yet, observe container size changes
          if (typeof window.ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(() => {
              if (checkAndPush()) {
                if (observer) {
                  observer.disconnect();
                  observer = null;
                }
              }
            });
            observer.observe(insElement);
            if (insElement.parentElement) {
              observer.observe(insElement.parentElement);
            }
          } else {
            // Fallback timer if ResizeObserver is not supported
            let attempts = 0;
            intervalId = setInterval(() => {
              if (!mounted || checkAndPush() || attempts++ > 30) {
                clearInterval(intervalId);
                intervalId = null;
              }
            }, 100);
          }
        }, 150);
      })
      .catch((err) => {
        console.error('AdSense script load error:', err);
        setFailed(true);
        if (onError) onError(err);
      });

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [location.pathname, onError]);

  // If script failed, bubble up via children
  if (failed) return null;

  // AdSense uses a specific ins element and global call to render ads.
  // We provide common attributes but the application should supply valid
  // adSlot values from their AdSense account when enabling ads.
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={mergedStyle}
      data-ad-client={ADSENSE_CLIENT || undefined}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-ad-layout-key={adLayoutKey}
      data-adtest={ADSENSE_TEST_MODE ? 'on' : undefined}
      ref={ref}
    />
  );
};

export default AdSense;

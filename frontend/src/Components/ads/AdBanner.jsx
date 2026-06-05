import React, { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import AdSense from './AdSense';
import { ADSENSE_ENABLED } from '../../config/ads';

// Top-of-page banner. Renders a placeholder unless ADSENSE_ENABLED is true.
const AdBanner = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return <AdPlaceholder variant="leaderboard" className={className} />;
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <AdSense
        adSlot="" // set your slot when enabling real AdSense
        adFormat="horizontal"
        style={{ display: 'block', width: '100%', maxWidth: 728, height: 90 }}
        onError={() => setAdsenseFailed(true)}
      />
    </div>
  );
};

export default AdBanner;

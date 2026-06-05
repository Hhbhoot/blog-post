import React, { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import AdSense from './AdSense';
import { ADSENSE_ENABLED } from '../../config/ads';

const AdSidebar = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return <AdPlaceholder variant="medium" className={className} />;
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <AdSense
        adSlot=""
        adFormat="auto"
        style={{ display: 'block', width: 300, height: 250 }}
        onError={() => setAdsenseFailed(true)}
      />
    </div>
  );
};

export default AdSidebar;

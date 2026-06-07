import React, { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import GoogleTestAd from './GoogleTestAd';
import { ADSENSE_ENABLED } from '../../config/ads';

// Sticky footer ad that remains visible at the bottom of the viewport.
// Uses placeholder when AdSense is disabled or when loading fails.
const AdStickyFooter = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  const containerStyle = {
    position: 'fixed',
    right: 12,
    bottom: 12,
    zIndex: 60,
    width: '300px',
    maxWidth: 'calc(100vw - 24px)',
  };

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return (
      <div style={containerStyle} className={className}>
        <AdPlaceholder variant="mobile" />
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <GoogleTestAd
        width="100%"
        height="250px"
        sizes={[300, 250]}
        style={{ margin: 0 }}
      />
    </div>
  );
};

export default AdStickyFooter;

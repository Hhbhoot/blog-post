import React, { useState, useEffect } from 'react';
import AdPlaceholder from './AdPlaceholder';
import AdSense from './AdSense';
import { ADSENSE_ENABLED } from '../../config/ads';

// Sticky footer ad that remains visible at the bottom of the viewport.
// Uses placeholder when AdSense is disabled or when loading fails.
const AdStickyFooter = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  // Ensure no layout shift on mount by reserving a small area
  useEffect(() => {
    // no-op for now, but useful if we add viewport listeners later
  }, []);

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
      <AdSense
        style={{
          display: 'block',
          borderRadius: 8,
          overflow: 'hidden',
        }}
        onError={() => setAdsenseFailed(true)}
      />
    </div>
  );
};

export default AdStickyFooter;

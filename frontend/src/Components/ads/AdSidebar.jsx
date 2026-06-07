import React, { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import GoogleTestAd from './GoogleTestAd';
import { ADSENSE_ENABLED } from '../../config/ads';

// Sidebar ad. Renders a placeholder unless ADSENSE_ENABLED is true.
const AdSidebar = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return <AdPlaceholder variant="medium" className={className} />;
  }

  return (
    <GoogleTestAd
      width="300px"
      height="250px"
      sizes={[300, 250]}
      className={className}
      style={{ margin: '10px 0' }}
    />
  );
};

export default AdSidebar;

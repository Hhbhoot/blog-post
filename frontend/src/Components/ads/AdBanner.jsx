import { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import GoogleTestAd from './GoogleTestAd';
import { ADSENSE_ENABLED } from '../../config/ads';

// Top-of-page and bottom-of-page banner. Renders a placeholder unless ADSENSE_ENABLED is true.
const AdBanner = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return <AdPlaceholder variant="leaderboard" className={className} />;
  }

  return (
    <GoogleTestAd
      width="728px"
      height="90px"
      sizes={[
        [728, 90],
        [320, 50],
      ]}
      className={className}
      style={{ margin: '10px 0' }}
    />
  );
};

export default AdBanner;

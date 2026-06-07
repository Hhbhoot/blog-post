import { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import GoogleTestAd from './GoogleTestAd';
import { ADSENSE_ENABLED } from '../../config/ads';

// In-content ad placement. Renders a placeholder unless ADSENSE_ENABLED is true.
const AdInContent = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return <AdPlaceholder variant="mobile" className={className} />;
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

export default AdInContent;

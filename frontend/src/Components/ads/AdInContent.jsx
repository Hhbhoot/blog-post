import { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';
import AdSense from './AdSense';
import { ADSENSE_ENABLED } from '../../config/ads';

const AdInContent = ({ className = '' }) => {
  const [adsenseFailed, setAdsenseFailed] = useState(false);

  if (!ADSENSE_ENABLED || adsenseFailed) {
    return <AdPlaceholder variant="mobile" className={className} />;
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center' }}
    >
      <AdSense
        adSlot="1295057918"
        adFormat="fluid"
        style={{ display: 'block', width: '100%', maxWidth: 728, minHeight: 100 }}
        onError={() => setAdsenseFailed(true)}
      />
    </div>
  );
};

export default AdInContent;

import { useState } from 'react';

// Professional-looking placeholder ad used when AdSense is disabled
// or when ad loading fails. Designed to be responsive and match
// common ad dimensions used in production.
const AdPlaceholder = ({
  variant = 'responsive',
  width,
  height,
  className = '',
}) => {
  // Generate random color only once using useState initializer (not during render)
  const [randomColor] = useState(() => {
    const colors = ['3B82F6', '8B5CF6', '10B981', 'F97316', 'EC4899', '14B8A6'];
    return colors[Math.floor(Math.random() * colors.length)];
  });

  // Map friendly variants to realistic dimensions
  const sizes = {
    leaderboard: { w: 728, h: 90 },
    medium: { w: 300, h: 250 },
    mobile: { w: 320, h: 100 },
    responsive: { w: '100%', h: 0 },
  };

  const size = sizes[variant] || { w: width || '100%', h: height || 0 };

  // Generate placeholder image URL based on dimensions
  const generatePlaceholderUrl = () => {
    const w = size.w === '100%' ? 600 : size.w;
    const h = size.h || 100;
    return `https://via.placeholder.com/${w}x${h}/${randomColor}/FFFFFF?text=Sponsored+Content`;
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size.w === '100%' ? '100%' : `${size.w}px`,
    height: size.h ? `${size.h}px` : 'auto',
    minHeight: size.h ? undefined : '60px',
    padding: '0px',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(2,6,23,0.04)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const labelStyle = {
    position: 'absolute',
    top: '8px',
    left: '10px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '4px 8px',
    borderRadius: '4px',
    zIndex: 10,
  };

  return (
    <div className={className} style={{ position: 'relative', width: '100%' }}>
      <div style={labelStyle}>Advertisement</div>
      <div style={containerStyle}>
        <img
          src={generatePlaceholderUrl()}
          alt="Ad placeholder"
          style={imageStyle}
          onError={(e) => {
            e.target.style.background =
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default AdPlaceholder;

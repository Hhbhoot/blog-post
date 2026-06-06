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
  // Generate random gradient only once using useState initializer
  const [gradient] = useState(() => {
    const gradients = [
      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', // Indigo-Violet
      'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', // Blue
      'linear-gradient(135deg, #059669 0%, #047857 100%)', // Emerald
      'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', // Orange
      'linear-gradient(135deg, #db2777 0%, #be185d 100%)', // Pink
      'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', // Teal
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  });

  // Map friendly variants to realistic dimensions
  const sizes = {
    leaderboard: { w: '100%', h: 90 },
    medium: { w: 300, h: 250 },
    mobile: { w: '100%', h: 100 },
    responsive: { w: '100%', h: 120 },
  };

  const size = sizes[variant] || { w: width || '100%', h: height || 120 };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: size.w === '100%' ? '100%' : `${size.w}px`,
    height: typeof size.h === 'number' ? `${size.h}px` : size.h,
    minHeight: typeof size.h === 'number' ? `${size.h}px` : '90px',
    padding: '16px',
    boxSizing: 'border-box',
    borderRadius: '16px',
    background: gradient,
    color: '#ffffff',
    textAlign: 'center',
    overflow: 'hidden',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const labelStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    padding: '4px 8px',
    borderRadius: '6px',
    zIndex: 10,
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={labelStyle}>Sponsor</div>
      <div style={containerStyle}>
        <div
          style={{
            fontWeight: 700,
            fontSize: size.h && size.h < 110 ? '14px' : '16px',
            marginBottom: '2px',
            letterSpacing: '-0.01em',
          }}
        >
          Sponsored Content Space
        </div>
        {(size.h === 'auto' ||
          (typeof size.h === 'number' && size.h >= 110)) && (
          <div style={{ fontSize: '12px', opacity: 0.9, maxWidth: '80%' }}>
            Google AdSense is active. Ads will appear here shortly once
            verified.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPlaceholder;

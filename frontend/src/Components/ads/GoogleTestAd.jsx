import React, { useEffect, useId } from 'react';

const GoogleTestAd = ({
  width = '300px',
  height = '250px',
  adUnitPath = '/6355419/Travel/Europe',
  sizes = [300, 250],
  className = '',
  style = {},
}) => {
  const reactId = useId();
  // Safe ID without colons for DOM/GPT selectors
  const elementId = `gpt-ad-${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    // 1. Ensure the script is injected globally
    if (!document.getElementById('gpt-script')) {
      const script = document.createElement('script');
      script.id = 'gpt-script';
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize the command queue
    window.googletag = window.googletag || { cmd: [] };
    let definedSlot = null;

    window.googletag.cmd.push(() => {
      const existingSlots = window.googletag.pubads().getSlots();
      const isAlreadyDefined = existingSlots.some(
        (slot) => slot.getSlotElementId() === elementId
      );

      if (!isAlreadyDefined) {
        // Define the slot with dynamic path, sizes, and unique ID
        definedSlot = window.googletag
          .defineSlot(adUnitPath, sizes, elementId)
          .addService(window.googletag.pubads());

        window.googletag.enableServices();
      } else {
        definedSlot = existingSlots.find(
          (slot) => slot.getSlotElementId() === elementId
        );
      }

      // Force Google to trigger a network call and display the ad layout
      window.googletag.display(elementId);
      if (definedSlot) {
        window.googletag.pubads().refresh([definedSlot]);
      }
    });

    // Cleanup to prevent memory leaks and duplicate ID errors on route changes / unmount
    return () => {
      if (definedSlot) {
        window.googletag.cmd.push(() => {
          window.googletag.destroySlots([definedSlot]);
        });
      }
    };
  }, [elementId, adUnitPath, JSON.stringify(sizes)]);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    width: '100%',
    ...style,
  };

  const adSlotStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    maxWidth: '100%',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
  };

  return (
    <div className={className} style={containerStyle}>
      <div id={elementId} style={adSlotStyle} />
    </div>
  );
};

export default GoogleTestAd;

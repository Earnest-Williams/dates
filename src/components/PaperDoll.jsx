import React from 'react';

/**
 * PaperDoll renders a multi-layer character avatar using CSS masks for tinting.
 * Images have been converted to alpha masks, allowing hardware-accelerated CSS rendering.
 */
const PaperDoll = ({ config, width = '100%', height = '100%', className = '' }) => {
  if (!config || !config.model) return null;

  const { model, outfit, skinTone, hairColor } = config;
  const basePath = `/paper_dolls/${model}`;

  // Using a container to handle the scaling/cropping so the avatar is nicely framed
  const absoluteStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 15%' // Centers horizontally, aligns near top vertically
  };

  const createMaskStyle = (maskFile, tintColor) => ({
    ...absoluteStyle,
    backgroundColor: tintColor,
    maskImage: `url(${basePath}/masks/${maskFile})`,
    maskSize: 'cover',
    maskPosition: 'center 15%',
    WebkitMaskImage: `url(${basePath}/masks/${maskFile})`,
    WebkitMaskSize: 'cover',
    WebkitMaskPosition: 'center 15%',
    mixBlendMode: 'multiply',
    pointerEvents: 'none'
  });

  return (
    <div 
      className={`paper-doll-container ${className}`} 
      style={{ 
        position: 'relative', 
        width, 
        height, 
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {/* 1. Skin Base */}
        <img src={`${basePath}/01_skin_visible_layer.png`} style={absoluteStyle} alt="skin" />
        
        {/* Skin Tint */}
        {skinTone && <div style={createMaskStyle('mask_skin_tintable_no_face_details.png', skinTone)} />}

        {/* 2. Underwear */}
        <img src={`${basePath}/03_underwear_base_layer.png`} style={absoluteStyle} alt="underwear" />

        {/* 3. Outfit */}
        {outfit && <img src={`${basePath}/extracted_${outfit}.png`} style={absoluteStyle} alt="outfit" />}

        {/* 4. Hair Base */}
        <img src={`${basePath}/04_hair_visible_layer.png`} style={absoluteStyle} alt="hair" />

        {/* Hair Tint */}
        {hairColor && <div style={createMaskStyle('mask_hair_visible.png', hairColor)} />}

        {/* 5. Face Details */}
        <img src={`${basePath}/02_face_details_overlay_optional.png`} style={absoluteStyle} alt="face" />
      </div>
    </div>
  );
};

export default PaperDoll;

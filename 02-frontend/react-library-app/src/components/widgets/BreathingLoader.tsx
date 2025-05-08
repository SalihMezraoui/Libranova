import React from 'react';

type BreathingLoaderProps = {
  size?: number;
  /** Color (default: '#3b82f6' - blue) */
  color?: string;
  /** Animation speed in seconds (default: 1.5) */
  speed?: number;
  /** Additional class names */
  className?: string;
};

export const BreathingLoader = ({ 
  size = 40, 
  color = '#003366',
  speed = 1.5,
  className = ''
}: BreathingLoaderProps) => {
  return (
    <div 
      className={`breathing-loader ${className}`}
      style={{
        '--loader-size': `${size}px`,
        '--loader-color': color,
        '--animation-speed': `${speed}s`,
      } as React.CSSProperties}
    />
  );
};





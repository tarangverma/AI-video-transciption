import React from 'react';

interface CaptionComponentProps {
  text: string;
  color?: string;
}

export const BottomCenteredCaption: React.FC<CaptionComponentProps> = ({
  text,
  color = '#FFFFFF',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '12px 24px',
        borderRadius: '8px',
        maxWidth: '80%',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          fontSize: '32px',
          fontWeight: 'bold',
          color,
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {text}
      </p>
    </div>
  );
};
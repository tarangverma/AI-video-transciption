import React from 'react';

interface CaptionComponentProps {
  text: string;
  color?: string;
}

export const TopBarCaption: React.FC<CaptionComponentProps> = ({
  text,
  color = '#FFFFFF',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '16px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
          fontSize: '28px',
          fontWeight: '600',
          color,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface CaptionComponentProps {
  text: string;
  color?: string;
}

export const KaraokeCaption: React.FC<CaptionComponentProps> = ({
  text,
  color = '#FFD700',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = Math.min((frame / fps) * 0.5, 1);
  const revealWidth = `${progress * 100}%`;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '85%',
      }}
    >
      <div style={{ position: 'relative' }}>
        <p
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#888888',
            margin: 0,
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {text}
        </p>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: revealWidth,
            overflow: 'hidden',
          }}
        >
          <p
            style={{
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
              fontSize: '36px',
              fontWeight: 'bold',
              color,
              margin: 0,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};
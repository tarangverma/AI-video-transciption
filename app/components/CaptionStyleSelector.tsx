import React from 'react';
import { CaptionStyleType } from './CaptionedVideo';

interface CaptionStyleSelectorProps {
  captionStyle: CaptionStyleType;
  onStyleChange: (style: CaptionStyleType) => void;
  onExport: () => void;
  showExport: boolean;
}

export const CaptionStyleSelector: React.FC<CaptionStyleSelectorProps> = ({
  captionStyle,
  onStyleChange,
  onExport,
  showExport,
}) => {
  const styles = [
    {
      value: 'bottom-centered' as const,
      label: '📺 Bottom Centered (Standard)',
    },
    {
      value: 'top-bar' as const,
      label: '📰 Top Bar (News Style)',
    },
    {
      value: 'karaoke' as const,
      label: '🎤 Karaoke Highlight',
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>🎨 Caption Style</h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => onStyleChange(style.value)}
            style={{
              padding: '12px',
              background: captionStyle === style.value ? '#667eea' : '#f3f4f6',
              color: captionStyle === style.value ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            {style.label}
          </button>
        ))}
      </div>

      {showExport && (
        <button
          onClick={onExport}
          style={{
            width: '100%',
            padding: '12px',
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '15px',
          }}
        >
          📥 Export Instructions
        </button>
      )}
    </div>
  );
};
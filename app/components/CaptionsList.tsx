import React from 'react';
import { CaptionSegment } from './CaptionedVideo';

interface CaptionsListProps {
  captions: CaptionSegment[];
}

export const CaptionsList: React.FC<CaptionsListProps> = ({ captions }) => {
  if (captions.length === 0) return null;

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '25px',
        marginTop: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>📝 Generated Captions</h3>
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        {captions.map((cap, idx) => (
          <div
            key={idx}
            style={{
              padding: '10px',
              background: '#f9fafb',
              borderRadius: '6px',
              marginBottom: '8px',
              fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            }}
          >
            <strong>
              {cap.start.toFixed(2)}s - {cap.end.toFixed(2)}s:
            </strong>{' '}
            {cap.text}
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { ChangeEvent } from 'react';

interface VideoUploadProps {
  onVideoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerateCaptions: () => void;
  isProcessing: boolean;
  hasApiKey: boolean;
  hasVideo: boolean;
  duration: number;
  captionsCount: number;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoUpload,
  onGenerateCaptions,
  isProcessing,
  hasApiKey,
  hasVideo,
  duration,
  captionsCount,
}) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginTop: 0 }}>📤 Upload Video</h3>
      <input
        type="file"
        accept="video/mp4"
        onChange={onVideoUpload}
        style={{
          marginBottom: '15px',
          width: '100%',
        }}
      />

      {hasVideo && (
        <>
          <button
            onClick={onGenerateCaptions}
            disabled={isProcessing || !hasApiKey}
            style={{
              width: '100%',
              padding: '12px',
              background: isProcessing ? '#ccc' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              marginBottom: '10px',
            }}
          >
            {isProcessing ? '⏳ Processing...' : '🎤 Auto-Generate Captions'}
          </button>

          <p
            style={{
              fontSize: '14px',
              color: '#666',
              margin: '10px 0',
            }}
          >
            Duration: {duration.toFixed(2)}s | Captions: {captionsCount}
          </p>
        </>
      )}
    </div>
  );
};
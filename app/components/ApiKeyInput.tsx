import React from 'react';

export default function ApiKeyInput({ apiKey, setApiKey, setShowApiInput }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🔑 Google AI Studio API Key</h3>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        Get your free API key from{' '}
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
          Google AI Studio
        </a>
      </p>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Google AI Studio (Gemini) API key"
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          marginBottom: '10px',
        }}
      />
      <button
        onClick={() => setShowApiInput(false)}
        disabled={!apiKey}
        style={{
          padding: '10px 20px',
          background: apiKey ? '#667eea' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: apiKey ? 'pointer' : 'not-allowed',
          fontWeight: '600',
        }}
      >
        Save API Key
      </button>
      <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
        💡 Tip: Keep videos under 1 minute for faster processing
      </p>
    </div>
  );
}

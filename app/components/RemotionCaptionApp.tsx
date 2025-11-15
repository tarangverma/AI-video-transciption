"use client";
import React, { useState, useRef, ChangeEvent } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { CaptionedVideo, Caption, CaptionStyleType  } from './CaptionedVideo';
import { CaptionStyleSelector } from './CaptionStyleSelector';
import { VideoUpload } from './VideoUpload';
import { CaptionsList } from './CaptionsList';

export default function RemotionCaptionApp() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyleType>('bottom-centered');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [showApiInput, setShowApiInput] = useState<boolean>(true);

  const playerRef = useRef<PlayerRef | null>(null);

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'video/mp4') {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setCaptions([]);

      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        setDuration(video.duration);
      };
    } else {
      alert('Please upload an MP4 file');
    }
  };

  const convertVideoToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64String = result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Unexpected FileReader result type'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateCaptions = async () => {
    if (!videoFile || !apiKey) {
      alert('Please upload a video and enter your Google AI Studio API key');
      return;
    }

    setIsProcessing(true);
    try {
      const videoBase64 = await convertVideoToBase64(videoFile);

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' +
          apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Transcribe the audio from this video with timestamps. For each sentence or phrase, provide the start time in seconds and the text. Support both Hindi (Devanagari) and English. Format your response as JSON array with objects containing 'start' (number in seconds), 'end' (number in seconds), and 'text' (string). Keep each caption segment short (5-8 words max). Example format: [{"start": 0, "end": 2.5, "text": "Hello world"}, {"start": 2.5, "end": 5.0, "text": "This is a test"}]. ONLY return the JSON array, no other text.`,
                  },
                  {
                    inline_data: {
                      mime_type: 'video/mp4',
                      data: videoBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      type GeminiPart = { text?: string };
      type GeminiContent = { parts: GeminiPart[] };
      type GeminiCandidate = {
        content: GeminiContent;
      };
      type GeminiResponse = {
        error?: { message?: string };
        candidates?: GeminiCandidate[];
      };

      const data: GeminiResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message ?? 'Unknown error');
      }

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No transcription generated');
      }

      const textContent = data.candidates[0].content.parts[0].text ?? '';

      let jsonText = textContent.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      // Allow any first, then normalize into Caption[]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedCaptions: any = JSON.parse(jsonText);

      const generatedCaptions: Caption[] = parsedCaptions
        .map((cap: any, idx: number) => {
          const start =
            typeof cap.start === 'number'
              ? cap.start
              : parseFloat(cap.start) || idx * 3;
          let end =
            typeof cap.end === 'number'
              ? cap.end
              : parseFloat(cap.end) || start + 3;

          if (end <= start) {
            end = start + 2;
          }

          const text: string = cap.text || cap.transcript || '';

          return {
            start,
            end,
            text,
          };
        })
        .filter((cap: Caption) => cap.text.trim().length > 0);

      if (generatedCaptions.length === 0) {
        throw new Error('No valid captions generated');
      }

      setCaptions(generatedCaptions);
      alert(`Generated ${generatedCaptions.length} caption segments!`);
    } catch (error: unknown) {
      console.error('Caption generation error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(
        `Error generating captions: ${message}\n\nPlease check:\n1. Your API key is valid\n2. Video has clear audio\n3. Video is not too long (try under 1 minute for testing)`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const exportVideo = () => {
    alert(
      'To export the video:\n\n' +
        '1. Install Remotion CLI: npm i -g @remotion/cli\n' +
        '2. Set up a Remotion project with this composition\n' +
        '3. Run: npx remotion render <composition-id> output.mp4\n\n' +
        'For client-side export, you can use screen recording tools while playing the video.'
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontSize: '42px',
              marginBottom: '10px',
              fontWeight: 700,
            }}
          >
            🎬 Remotion Video Captioning
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '18px',
            }}
          >
            Upload video → Auto-generate captions → Preview with styles
          </p>
        </div>

        {showApiInput && (
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>🔑 Google AI Studio API Key</h3>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '10px',
              }}
            >
              Get your free API key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#667eea' }}
              >
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
                fontWeight: 600,
              }}
            >
              Save API Key
            </button>
            <p
              style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '10px',
              }}
            >
              💡 Tip: Keep videos under 1 minute for faster processing
            </p>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <VideoUpload
            onVideoUpload={handleVideoUpload}
            onGenerateCaptions={generateCaptions}
            isProcessing={isProcessing}
            hasApiKey={!!apiKey}
            hasVideo={!!videoUrl}
            duration={duration}
            captionsCount={captions.length}
          />

          <CaptionStyleSelector
            captionStyle={captionStyle}
            onStyleChange={setCaptionStyle}
            onExport={exportVideo}
            showExport={!!videoUrl && captions.length > 0}
          />
        </div>

        {videoUrl && captions.length > 0 && (
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>🎥 Preview with Captions</h3>
            <div
              style={{
                background: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Player
                ref={playerRef}
                component={CaptionedVideo}
                inputProps={{
                  videoSrc: videoUrl,
                  captions,
                  style: captionStyle,
                  durationInFrames: Math.ceil(duration * 30),
                  fps: 30,
                }}
                durationInFrames={Math.ceil(duration * 30)}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{ width: '100%' }}
                controls
              />
            </div>
          </div>
        )}

        <CaptionsList captions={captions} />
      </div>
    </div>
  );
};
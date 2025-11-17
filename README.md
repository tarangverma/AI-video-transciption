# 🎬 Remotion Captioned Video App

A React + Remotion app that:

- Lets you upload a video in the browser
- Generates captions automatically using the Gemini API (Google AI Studio)
- Previews multiple caption styles (bottom-centered, top bar, karaoke)
- Exports the final MP4 using the Remotion CLI

This README explains how to:

- Run the app locally
- Configure the Gemini API key
- Use sample videos from the `public/` folder
- Render videos using:
  - A static file (bundled with the project)
  - A remote `videoSrc` URL (e.g. S3 or another static host)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ (recommended)
- npm or yarn
- FFmpeg installed and available on your `PATH` (required by Remotion for encoding)

### 2. Install dependencies

- npm install or yarn install

  
### 3. Start the dev server

- npm run dev or yarn dev


Then open the URL printed in the terminal (usually `http://localhost:3000` if using Next.js).

---

## 🧠 Gemini (Google AI Studio) API Key

The app uses Gemini to automatically generate captions from your video.

---

## 🎥 Using the Web UI

1. **Upload a video**

   - Click **Upload Video** and select an MP4 file from your computer.
   - The app will show video duration and current caption count.

2. **Generate captions**

   - Click **“🎤 Auto-Generate Captions”**.
   - The app sends the video to Gemini with a transcription prompt.
   - Once done, you’ll see:
     - A live preview with captions
     - A scrollable list of generated caption segments

3. **Choose a caption style**

   - Options:
     - Bottom Centered (standard)
     - Top Bar (news style)
     - Karaoke Highlight
   - Click one of the style buttons to update the preview.

4. **Export instructions**

   - Click **“📥 Export Instructions”** to see CLI instructions for exporting the video with Remotion.

---

## 🧩 Composition Reference

The main Remotion composition is:

```
// app/components/CaptionedVideo.tsx

export type CaptionStyleType = 'bottom-centered' | 'top-bar' | 'karaoke';

export interface Caption {
start: number;
end: number;
text: string;
}

export interface CaptionedVideoProps {
videoSrc?: string; // Video URL (optional if using static sample)
captions: Caption[]; // [{ start, end, text }, ...]
style: CaptionStyleType; // 'bottom-centered' | 'top-bar' | 'karaoke'
fps?: number; // Optional, default 30
}
```
## 
The composition registration:
```
// app/RemotionRoot.tsx (example)

import { Composition } from 'remotion';
import { CaptionedVideo, CaptionedVideoProps } from './components/CaptionedVideo';

export const RemotionRoot: React.FC = () => {
const durationInFrames = 30 * 60; // example: 30 seconds @ 60fps
const fps = 30;

const defaultProps: CaptionedVideoProps = {
captions: [],
style: 'bottom-centered',
// videoSrc is optional: if not provided, component can fallback to a static sample
};

return (
<>
<Composition id="CaptionedVideo" component={CaptionedVideo} durationInFrames={durationInFrames} fps={fps} width={1920} height={1080} defaultProps={defaultProps} />
</>
);
};
```


---

## 📁 Option A: Use a Static Sample Video (from `public/`)

This is the easiest way for others to try the app without hosting their own video.

### 1. Place sample videos

Add your sample MP4 files to `public/sample-videos/`, for example:

- `public/sample-videos/demo1.mp4`
- `public/sample-videos/demo2.mp4`

### 2. Use `staticFile()` in the composition

```
// app/components/CaptionedVideo.tsx

import { AbsoluteFill, Video } from 'remotion';
import { staticFile } from 'remotion';

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
videoSrc,
captions,
style,
fps = 30,
}) => {
const src = videoSrc ?? staticFile('sample-videos/demo1.mp4');
// ^ If no videoSrc prop is passed, fall back to demo1.mp4

// ... use src in <Video />
return (
<AbsoluteFill style={{ backgroundColor: '#000' }}>
<Video
src={src}
style={{ width: '100%', height: '100%', objectFit: 'contain' }}
/>
{/* caption rendering here */}
</AbsoluteFill>
);
};
```

### 3. Render with the sample video (no extra props)

Because the sample file is hardcoded via `staticFile()`, you can render directly:

- npx remotion render app/components/VideoApp.tsx CaptionedVideo output.mp4

This will render the composition using `public/sample-videos/demo1.mp4`.

---

## 🌐 Option B: Use a Remote Video URL (S3, etc.)

Users who already have a video in S3 or any static host can render using a `videoSrc` prop.

### Requirements for `videoSrc`

- The URL must point directly to the video file, e.g.:
  https://my-bucket.s3.amazonaws.com/my-video.mp4
- It should **not** be a viewer page (like Google Drive preview or MEGA share links).
- It must send `Content-Type: video/mp4` and allow cross-origin access.

### 1. Inline JSON props (Unix/macOS shells)

```
npx remotion render CaptionedVideo output.mp4
--props='{
"videoSrc": "https://my-bucket.s3.amazonaws.com/my-video.mp4",
"captions": [
{ "start": 0, "end": 2.5, "text": "Hello world" },
{ "start": 2.5, "end": 5.0, "text": "This is a test" }
],
"style": "bottom-centered",
"fps": 30
}'
```


Notes:

- Keys and string values **must** use double quotes.
- No trailing commas.
- `captions` must be a real array, not `[...]`.

### 2. Using a `props.json` file (recommended for large captions)

Create `props.json`:

```
{
"videoSrc": "https://my-bucket.s3.amazonaws.com/my-video.mp4",
"captions": [
{ "start": 0, "end": 2.5, "text": "Hello world" },
{ "start": 2.5, "end": 5.0, "text": "This is a test" }
],
"style": "bottom-centered",
"fps": 30
}
```

Then render:
npx remotion render CaptionedVideo output.mp4 --props=props.json

---





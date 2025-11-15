import React from 'react';
import { AbsoluteFill, useCurrentFrame, Video } from 'remotion';
import { BottomCenteredCaption } from './captions/BottomCenteredCaption';
import { TopBarCaption } from './captions/TopBarCaption';
import { KaraokeCaption } from './captions/KaraokeCaption';

export type CaptionStyleType = 'bottom-centered' | 'top-bar' | 'karaoke';

export interface Caption {
  start: number;
  end: number;
  text: string;
}

export interface CaptionedVideoProps {
  videoSrc: string;
  captions: Caption[];
  style: CaptionStyleType;
  durationInFrames: number;
  fps: number;
}

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  videoSrc,
  captions,
  style,
  fps,
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;

  const currentCaption = captions.find(
    (cap) => currentTime >= cap.start && currentTime < cap.end
  );

  const CaptionComponent = 
    style === 'top-bar' ? TopBarCaption :
    style === 'karaoke' ? KaraokeCaption :
    BottomCenteredCaption;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Video
        src={videoSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
      {currentCaption && (
        <CaptionComponent text={currentCaption.text} />
      )}
    </AbsoluteFill>
  );
};

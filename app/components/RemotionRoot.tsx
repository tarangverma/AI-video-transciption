import React from 'react';
import { Composition, staticFile } from 'remotion';
import {
  CaptionedVideoProps,
  CaptionedVideo,
} from './CaptionedVideo';

export const RemotionRoot: React.FC = () => {
  const durationInFrames = 30 * 60;
  const fps = 30;
  
  const defaultProps: CaptionedVideoProps = {
    videoSrc: staticFile('vv.mp4'),
    captions: [],
    style: 'bottom-centered',
    fps: fps
  };

  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};

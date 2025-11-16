// CaptionedVideo.tsx
import React, { FC } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { BottomCenteredCaption } from "./captions/BottomCenteredCaption";
import { TopBarCaption } from "./captions/TopBarCaption";
import { KaraokeCaption } from "./captions/KaraokeCaption";

export type CaptionSegment = {
  start: number;
  end: number;
  text: string;
};

export type CaptionStyle = "bottom-centered" | "top-bar" | "karaoke";

export type CaptionedVideoProps = {
  videoSrc: string;
  captions: CaptionSegment[];
  style: CaptionStyle;
  // Optional: fps if you want to override
  fps?: number;
};

export const CaptionedVideoSchema = {
  durationInFrames: 30 * 60, // 30 seconds default
  fps: 30,
  width: 1920,
  height: 1080,
  defaultProps: {
    videoSrc: "",
    captions: [] as CaptionSegment[],
    style: "bottom-centered" as CaptionStyle,
  } satisfies CaptionedVideoProps,
};

export const CaptionedVideo: FC<CaptionedVideoProps> = ({
  videoSrc,
  captions,
  style,
  fps = 30,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const currentTime = frame / fps;

  const currentCaption = captions.find(
    (cap) => currentTime >= cap.start && currentTime <= cap.end
  );

  const CaptionComponent =
    style === "top-bar" ? TopBarCaption : style === "karaoke" ? KaraokeCaption : BottomCenteredCaption;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={videoSrc}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {currentCaption && <CaptionComponent text={currentCaption.text} />}
    </AbsoluteFill>
  );
};

export default CaptionedVideo;

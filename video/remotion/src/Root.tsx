import React from "react";
import { Composition } from "remotion";
import { UlisVibeVideo } from "./UlisVibeVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="UlisVibeVideo"
        component={UlisVibeVideo}
        durationInFrames={2700} // 45s * 60fps
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};

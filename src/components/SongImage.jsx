import React from "react";
import TrackImage from "./TrackImage";

/**
 * SongImage component that now uses the more efficient TrackImage component.
 * This forwards to TrackImage to maintain backward compatibility while getting
 * all the optimization benefits of TrackImage.
 */
const SongImage = React.memo(
  ({ src, alt, className }) => {
    return (
      <TrackImage src={src} alt={alt || "Song artwork"} className={className} />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if src changes
    return prevProps.src === nextProps.src;
  }
);

SongImage.displayName = "SongImage"; // For React DevTools

export default SongImage;

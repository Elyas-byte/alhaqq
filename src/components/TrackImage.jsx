import React from "react";

/**
 * A highly optimized track image component that prevents re-renders
 * when parent components update, specifically designed to solve the image
 * reloading issue during audio playback.
 */
const TrackImage = ({ src, alt, className }) => {
  // Using a simple div + background-image approach which typically has better caching
  // behavior than regular img tags in some browsers
  if (!src) {
    return (
      <div
        className={`${
          className || ""
        } bg-gray-800 flex items-center justify-center`}
        role="img"
        aria-label={alt || "No image available"}
      >
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <div
      className={className || ""}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      role="img"
      aria-label={alt || "Track artwork"}
    />
  );
};

// Wrap with React.memo for maximum optimization
const MemoizedTrackImage = React.memo(
  TrackImage,
  // Custom comparison function to ensure we only re-render when absolutely necessary
  (prevProps, nextProps) => {
    // Only re-render if src changes
    return prevProps.src === nextProps.src;
  }
);

MemoizedTrackImage.displayName = "TrackImage";

export default MemoizedTrackImage;

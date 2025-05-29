import React from "react";

/**
 * A highly optimized artist image component that prevents re-renders
 * when parent components update, specifically designed for artist portraits
 * and banner images to avoid unnecessary network requests.
 */
const ArtistImage = ({ src, alt, className, type = "portrait" }) => {
  // Using a div with background-image styling for better caching behavior
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

  // Apply different styling based on the type of image (portrait or banner)
  let bgSize = "cover";
  let bgPosition = "center";

  if (type === "banner") {
    bgPosition = "center top";
  }

  return (
    <div
      className={className || ""}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
        backgroundRepeat: "no-repeat",
      }}
      role="img"
      aria-label={alt || "Artist image"}
    />
  );
};

// Wrap with React.memo for maximum optimization
const MemoizedArtistImage = React.memo(
  ArtistImage,
  // Custom comparison function to ensure we only re-render when absolutely necessary
  (prevProps, nextProps) => {
    // Only re-render if src changes
    return prevProps.src === nextProps.src;
  }
);

MemoizedArtistImage.displayName = "ArtistImage";

export default MemoizedArtistImage;

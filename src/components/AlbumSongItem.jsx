import React, { useCallback } from "react";
import TrackImage from "./TrackImage";

// This component is specifically designed to render song items in the album view
// It's separated to prevent re-renders when the audio progress updates
const AlbumSongItem = React.memo(({ item, index, playWithId }) => {
  // Create memoized play handler for each song
  const handlePlay = useCallback(() => {
    playWithId(item.id);
  }, [playWithId, item.id]);

  return (
    <div
      onClick={handlePlay}
      className="grid grid-cols-3 gap-2 p-2 items-center text-[#a7a7a7] transition-colors duration-300 hover:bg-[#ffffff2b] cursor-pointer"
    >
      <p className="text-[#EAEAEA]">
        <p className="mr-4 text-[#a7a7a7] inline">{index + 1}</p>
        <TrackImage
          src={item.image}
          className="inline w-10 h-10 mr-5"
          alt={item.name}
        />
        {item.name}
      </p>
      <p className="text-[15px]">{item.desc}</p>
      <p className="text-15px text-center">{item.duration}</p>
    </div>
  );
});

AlbumSongItem.displayName = "AlbumSongItem";

export default AlbumSongItem;

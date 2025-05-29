import React, { useCallback } from "react";
import TrackImage from "./TrackImage";

/**
 * Optimized search result item component that prevents unnecessary re-renders
 * when the search results list is displayed during audio playback
 */
const SearchResultItem = React.memo(({ item, playWithId }) => {
  // Memoized click handler to prevent function recreation on each render
  const handlePlay = useCallback(() => {
    playWithId(item.id);
  }, [playWithId, item.id]);

  return (
    <div
      onClick={handlePlay}
      className="grid grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] transition-colors duration-300 hover:bg-[#ffffff2b] cursor-pointer"
    >
      <div className="text-white flex items-center">
        <TrackImage
          src={item.image}
          alt={item.name}
          className="w-10 h-10 mr-5"
        />
        {item.name}
      </div>
      <p className="text-[15px]">{item.desc}</p>
      <p className="text-[15px]">{item.albumN}</p>
      <p className="text-[15px] text-center">{item.duration}</p>
    </div>
  );
});

SearchResultItem.displayName = "SearchResultItem";

export default SearchResultItem;

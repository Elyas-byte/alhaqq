import React, { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TrackImage from "./TrackImage";

const AlbumItem = ({ image, name, desc, id }) => {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const navigate = useNavigate();

  // Memoize the navigation handler to avoid creating a new function on every render
  const handleNavigate = useCallback(() => {
    navigate(`/album/${id}`);
  }, [navigate, id]);

  return (
    <div
      onClick={handleNavigate}
      className="min-w-[180px] p-2 px-3 rounded bg-[#191919] mx-1 cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
    >
      {" "}
      <TrackImage
        className="rounded w-[156px] h-[156px]"
        src={image}
        alt={name}
      />
      <p className="font-bold text-[#EAEAEA] mt-2 mb-1">{name}</p>
      <p className="text-[#A9A9A9] text-sm">{desc}</p>
    </div>
  );
};
// Memoize the entire AlbumItem component
const MemoizedAlbumItem = React.memo(AlbumItem);
MemoizedAlbumItem.displayName = "AlbumItem"; // For React DevTools

export default MemoizedAlbumItem;

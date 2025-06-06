import React, { Fragment, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { albumsData, assets, songsData } from "../assets/assets";
import { PlayerActionsContext } from "../context/PlayerActionsContext";
import { SidebarContext } from "../context/NavbarContext";
import Account from "./Account";
import TrackImage from "./TrackImage";
import AlbumSongItem from "./AlbumSongItem";

const DisplayAlbum = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const { playWithId } = useContext(PlayerActionsContext);

  const { id } = useParams();
  const albumData = albumsData[id];
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Account />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end text-[#EAEAEA]">
        {" "}
        <TrackImage
          className="w-48 h-48 rounded object-cover"
          src={albumData.image}
          alt={albumData.name}
        />
        <div className="flex flex-col">
          {" "}
          <p>{t("album")}</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {albumData.name}
          </h2>
          <h4>{albumData.desc}</h4>
          <p className="mt-1">
            <TrackImage
              className="inline-block w-5"
              src={assets.alhaqq}
              alt="Al-Haqq logo"
            />
            <b> {t("name")}</b>
          </p>
        </div>
      </div>{" "}
      <div className="grid grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b> {t("title")}
        </p>
        <p>Artist</p>
        <TrackImage
          className="m-auto w-4"
          src={assets.clock_icon}
          alt="Duration icon"
        />
      </div>{" "}
      <hr />{" "}
      {songsData
        .filter((item) => item.album === id)
        .map((item, index) => (
          <AlbumSongItem
            key={item.id}
            item={item}
            index={index}
            playWithId={playWithId}
          />
        ))}
    </>
  );
};

// Memo-ize the entire component to prevent unnecessary rerenders
const MemoizedDisplayAlbum = React.memo(DisplayAlbum);
MemoizedDisplayAlbum.displayName = "DisplayAlbum";

export default MemoizedDisplayAlbum;

import React, { useContext } from "react";
import { PlayerActionsContext } from "../context/PlayerActionsContext";
import { useDrag, useDrop } from "react-dnd";
import { useState, useCallback } from "react";
import { SidebarContext } from "../context/NavbarContext";
import Navbar from "./Navbar";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { artistsData } from "../assets/assets";
import { useTranslation } from "react-i18next";

const QueueItem = ({ song, index, moveSong, onDelete }) => {
  const { track } = useContext(PlayerActionsContext);
  const navigate = useNavigate();

  const [{ isDragging }, dragRef] = useDrag({
    type: "song",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Use drop hook
  const [, dropRef] = useDrop({
    accept: "song",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSong(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const dragDropRef = (el) => {
    dragRef(el);
    dropRef(el);
  };

  return (
    <div
      ref={dragDropRef}
      className={`grid grid-cols-4 items-center rounded p-2 mb-2 cursor-move mb-1 transition-all duration-200 ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${track.id === song.id ? "bg-[#292929]" : "bg-[#191919]"}`}
    >
      <div className="flex items-center">
        <img src={song.image} className="w-9" />
        <span className="ml-4 text-sm font-medium">{song.name}</span>
      </div>
      <span
        className="text-sm font-medium hover:underline"
        onClick={() => {
          const artist = artistsData.find(
            (artist) => artist.name === song.desc
          );
          if (artist) {
            navigate(`/artist/${artist.id}`);
          }
        }}
      >
        {song.desc}
      </span>
      <span
        className="text-sm font-medium hover:underline"
        onClick={() => navigate(`/album/${song.album}`)}
      >
        {song.albumN}
      </span>
      <button
        onClick={() => {
          if (track.id !== song.id) {
            onDelete(song.id);
          }
        }}
        className="p-1 rounded-full hover:bg-[#ffffff26] ml-auto"
      >
        <img className="w-5 " src={assets.rm} />
      </button>
    </div>
  );
};

const Queue = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const { queue, setQueue, removeFromQueue } = useContext(PlayerActionsContext);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  const moveSong = useCallback(
    (dragIndex, hoverIndex) => {
      const updatedQueue = [...queue];
      const [movedSong] = updatedQueue.splice(dragIndex, 1);
      updatedQueue.splice(hoverIndex, 0, movedSong);
      setQueue(updatedQueue);
    },
    [queue, setQueue]
  );

  // Handle delete
  const handleDelete = (id) => {
    removeFromQueue(id);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="w-full mx-auto mt-4 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">{t("queue")}</h2>
        {queue.map((song, index) => (
          <QueueItem
            key={song.id}
            song={song}
            index={index}
            moveSong={moveSong}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
};

export default Queue;

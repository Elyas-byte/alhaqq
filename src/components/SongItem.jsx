import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { PlayerActionsContext } from "../context/PlayerActionsContext";
import { assets } from "../assets/assets";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import TrackImage from "./TrackImage";

const SongItem = ({ image, name, desc, id }) => {
  const { t, i18n } = useTranslation();
  const { playWithId, addToQueue } = useContext(PlayerActionsContext);
  const auth = getAuth();
  const db = getFirestore();

  // State to manage context menu visibility and position
  const [contextMenu, setContextMenu] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

  // State to manage playlists
  const [playlists, setPlaylists] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  document.body.dir = i18n.dir();

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const { playlists: userPlaylists } = userDocSnap.data();

          if (userPlaylists && userPlaylists.length > 0) {
            // Fetch all playlists in parallel using Promise.all
            const playlistsPromises = userPlaylists.map(async (playlistId) => {
              const playlistRef = doc(db, "playlists", playlistId);
              const playlistSnap = await getDoc(playlistRef);
              if (playlistSnap.exists()) {
                return { id: playlistSnap.id, ...playlistSnap.data() };
              }
              return null; // Return null if the playlist does not exist
            });

            const fetchedPlaylists = await Promise.all(playlistsPromises);
            const validPlaylists = fetchedPlaylists.filter(Boolean); // Filter out any null values
            setPlaylists(validPlaylists); // Set the valid playlists in state
            console.log(validPlaylists); // Log the fetched playlists (comment this out if building!!)
          }
        }
      }
    };

    fetchUserPlaylists();
  }, [auth, db]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX + 2,
      mouseY: e.clientY - 6,
    });
  };

  const handleTouchStart = (e) => {
    setLongPressTimer(
      setTimeout(() => {
        handleContextMenu(e);
      }, 500)
    );
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleOptionClick = (option) => {
    if (option === "play") {
      playWithId(id);
    } else if (option === "queue") {
      addToQueue(id);
    }
    // Close context menu after an option is selected
    setContextMenu(null);
    setIsDropdownOpen(false);
  };
  const handleAddToPlaylist = async (playlistId) => {
    const songRef = doc(db, "playlists", playlistId);
    await updateDoc(songRef, {
      songs: arrayUnion(id),
    });
    setContextMenu(null);
    setIsDropdownOpen(false);
  };

  const handleClickAway = () => {
    setContextMenu(null);
    setIsDropdownOpen(false);
  };
  const handleMouseEnterDropdown = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Memoize the playWithId handler to avoid creating a new function on every render
  const handlePlay = useCallback(() => {
    playWithId(id);
  }, [playWithId, id]);

  return (
    <Fragment>
      <div
        onClick={handlePlay}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="min-w-[180px] p-2 px-3 bg-[#191919] mx-1 rounded cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
      >
        {" "}
        <TrackImage
          className="rounded w-[156px] h-[156px]"
          src={image}
          alt={name}
        />
        <p className="font-bold mt-2 mb-1">{name}</p>
        <p className="text-[#A9A9A9] text-sm">{desc}</p>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 bg-[#2a2a2a] text-[#EAEAEA] rounded shadow-lg"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          <ul>
            {" "}
            <li
              onClick={() => handleOptionClick("play")}
              className="p-2 flex cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
            >
              {" "}
              <TrackImage
                src={assets.play_icon}
                className="w-6 h-6 mr-2"
                alt="Play"
              />{" "}
              {t("play")}
            </li>
            <li
              onClick={() => handleOptionClick("queue")}
              className="p-2 flex cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
            >
              <TrackImage
                src={assets.queue_icon}
                className="w-6 h-6 mr-2"
                alt="Add to queue"
              />{" "}
              {t("a_q")}
            </li>
            <li
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              className="p-2 flex cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
            >
              <span>{t("add_to_playlist")}</span>
            </li>
          </ul>

          {isDropdownOpen && playlists.length > 0 && (
            <div
              className="absolute bg-[#2a2a2a] text-[#EAEAEA] rounded shadow-lg"
              style={{
                top: "75%",
                left: "100%",
                transform: "translateY(-50%)",
              }}
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <ul>
                {playlists.map((playlist) => (
                  <li
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="p-2 flex cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
                  >
                    {playlist.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Click away listener to close context menu */}
      {contextMenu && (
        <div
          onClick={handleClickAway}
          onContextMenu={handleClickAway}
          className="fixed inset-0 z-40"
        ></div>
      )}
    </Fragment>
  );
};

// Memoize the entire SongItem component
const MemoizedSongItem = React.memo(SongItem);
MemoizedSongItem.displayName = "SongItem"; // For React DevTools

export default MemoizedSongItem;

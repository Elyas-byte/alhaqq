import React, { useContext, useEffect, useState } from "react";
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../context/NavbarContext";
import { getFirestore, doc, getDoc, collection, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  document.body.dir = i18n.dir();
  const navigate = useNavigate();
  const { isSidebarOpen } = useContext(SidebarContext);

  const [playlists, setPlaylists] = useState([]);
  const [likedPlaylist, setLikedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  useEffect(() => {
    if (user) {
      fetchUserPlaylists();
    }
  }, [user]);

  const fetchUserPlaylists = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userPlaylists = userData.playlists || [];
        const likedPlId = userData.likedPl;

        if (likedPlId) {
          const likedPlaylistDoc = await getDoc(doc(db, "playlists", likedPlId));
          if (likedPlaylistDoc.exists()) {
            setLikedPlaylist({ id: likedPlaylistDoc.id, ...likedPlaylistDoc.data() });
          }
        }

        const playlistDocs = await Promise.all(
          userPlaylists.map((playlistId) => getDoc(doc(db, "playlists", playlistId)))
        );

        const fetchedPlaylists = playlistDocs
          .filter((doc) => doc.exists())
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setPlaylists(fetchedPlaylists);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName || !iconFile) {
      alert("Please provide a name and an icon for your playlist.");
      return;
    }

    try {
      const iconRef = ref(storage, `playlist_icons/${iconFile.name}`);
      await uploadBytes(iconRef, iconFile);
      const iconURL = await getDownloadURL(iconRef);

      const newPlaylist = await addDoc(collection(db, "playlists"), {
        createdAt: new Date(),
        name: newPlaylistName,
        public: false,
        icon: iconURL
      });

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        playlists: [...playlists.map((pl) => pl.id), newPlaylist.id]
      });

      setPlaylists([...playlists, { id: newPlaylist.id, name: newPlaylistName, public: false, icon: iconURL }]);
      setNewPlaylistName("");
      setIconFile(null);
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await deleteDoc(doc(db, "playlists", playlistId));

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        playlists: playlists.filter((pl) => pl.id !== playlistId)
      });

      setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  return (
    <div
      className={`fixed rounded z-10 lg:static top-0 left-0 lg:left-auto lg:m-2 lg:translate-x-0 w-[75%] md:w-[50%] lg:w-[16%]  h-full lg:h-[98%] p-2 flex-col gap-2 text-[#EAEAEA] bg-[#121212] transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:flex lg:translate-x-0`}
    >
      <div className="h-[22.5%] rounded flex flex-col justify-around">
        <div className="flex items-center gap-3 pl-7 cursor-pointer" onClick={() => navigate("/")}>
          <img className="w-11" src={assets.alhaqq} alt="Logo" />
          <p className="font-bold text-xl">{t('name')}</p>
        </div>

        {likedPlaylist && (
          <div onClick={() => navigate(`/playlist/${likedPlaylist.id}`)} className="flex items-center cursor-pointer gap-3 pl-9 py-1 bg-[#191919] rounded mb-2 mt-4 transition-colors duration-300 hover:bg-[#ffffff26]">
            <img className="h-[36px]" src={assets.like_icon} alt="Liked Playlist" />
            <p className="font-bold text-xl">{t("Liked")}</p>
          </div>
        )}

        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center gap-3 pl-9 cursor-pointer py-1 bg-[#191919] rounded my-2 transition-colors duration-300 hover:bg-[#ffffff26]">
            <p className="font-bold text-xl" onClick={() => navigate(`/playlist/${playlist.id}`)}>{playlist.name}</p>
            <button onClick={() => deletePlaylist(playlist.id)} className="ml-auto text-red-500">
              <img className="w-6 mx-1 hover:bg-[#ffffff26] rounded-full transition-colors duration-300" src={assets.rm} />
            </button>
          </div>
        ))}

        {user ? (
          <button
            onClick={() => setIsModalOpen(true)} // Open modal
            className="w-full py-2 bg-red-800 transition-colors duration-300 hover:bg-red-700 text-white rounded mt-4"
          >
            {t('create_playlist')}
          </button>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => navigate("/signup")}
              className="w-full py-2 bg-white transition-colors duration-300 hover:bg-slate-200 text-black rounded"
            >
              {t('signup')}
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2 bg-red-800 transition-colors duration-300 hover:bg-red-700 text-white rounded"
            >
              {t('login')}
            </button>
          </div>
        )}
      </div>

      {/* Modal for creating a playlist */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#1E1E1E] rounded-lg p-6 w-80">
            <h2 className="text-lg font-bold text-white">Create Playlist</h2>
            <input
              type="text"
              placeholder="Enter playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-[#2A2A2A] text-white rounded mt-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setIconFile(e.target.files[0]);
                }
              }}
              className="w-full p-2 border border-gray-600 bg-[#2A2A2A] text-white rounded mt-2"
            />
            <div className="flex justify-between mt-4">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-600 transition-colors duration-300 hover:bg-gray-800 p-2 rounded text-white">Cancel</button>
              <button onClick={createPlaylist} className="bg-red-700 hover:bg-red-900 transition-colors duration-300 text-white p-2 rounded">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { assets, songsData } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { SidebarContext } from "../context/NavbarContext";
import Account from "./Account";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Playlist = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const { playWithId, addToQueue } = useContext(PlayerContext); // Add addToQueue to context

    const { id } = useParams();
    const [playlistData, setPlaylistData] = useState(null);
    const [songs, setSongs] = useState([]);
    const db = getFirestore();
    const auth = getAuth();
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Adjust as needed
    }, []);

    useEffect(() => {
        setPlaylistData(null);
        setSongs([]);
        fetchPlaylistData();
    }, [id]);
    
    useEffect(() => {
        fetchPlaylistData();
    }, [id]);

    const fetchPlaylistData = async () => {
        try {
            const user = auth.currentUser;
            const playlistRef = doc(db, "playlists", id);
            const playlistSnapshot = await getDoc(playlistRef);

            if (playlistSnapshot.exists()) {
                const playlist = playlistSnapshot.data();
                setPlaylistData(playlist);

                // Match song IDs with the info from songsData
                const matchedSongs = playlist.songs.map(songId =>
                    songsData.find(song => song.id === songId) || { id: songId, name: "Unknown", desc: "Unknown", duration: "Unknown", image: assets.default_song_image } // Add image fallback
                );

                setSongs(matchedSongs);
            } else {
                console.error("Playlist not found");
            }
        } catch (error) {
            console.error("Error fetching playlist:", error);
        }
    };

    const handlePlayAll = () => {
        // Add each song ID to the queue individually
        songs.forEach(song => {
            addToQueue(song.id);
        });

        // Play the first song in the queue
        playWithId(songs[0].id);
    };

    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} />
            <Account />
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end text-[#EAEAEA]">
                <img
                    className="w-48 h-48 rounded object-cover"
                    src={playlistData?.icon || assets.liked} // Use playlist image or default
                    alt="Playlist Cover"
                />
                <div className="flex flex-col">
                    <p>{t("playlist")}</p>
                    <h2 className="text-5xl font-bold mb-4 md:text-7xl">{playlistData?.name || "Playlist"}</h2>
                    <h4>{playlistData?.description}</h4>
                    <p className="mt-1">
                        <img className="inline-block w-5" src={assets.alhaqq} alt="Alhaqq Logo" />
                        <b> {t("name")}</b>
                    </p>
                    <button
                        onClick={handlePlayAll}
                        className="mt-4 bg-red-900 shadow-[3px_6px_4px_1px_rgba(0,0,0,0.25)] hover:bg-red-800 transition-colors duration-300 w-28 text-[#EAEAEA] py-2 px-4 rounded-full flex items-center"
                    >
                        <span className="mr-2 shadow-lg ">{t('p_all')}</span>
                        <img className="w-4 m-auto" src={assets.play_icon} alt="Play Icon" />
                    </button>
                </div>
            </div>

            <hr className="mt-3" />
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center">
                        <div className="w-12 aspect-square rounded-full border-8 border-red-500 border-t-transparent animate-spin"></div>
                    </div>
                )}
                <div className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    {songs.map((song, index) => (
                        <div
                            key={song.id}
                            className="grid grid-cols-4 gap-4 py-2 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-300"
                            onClick={() => playWithId(song.id)}
                        >
                            <div className="flex items-center">
                                <p className="mr-4">{index + 1}</p>
                                <img
                                    className="w-7 h-7 rounded object-cover"
                                    src={song.image || assets.default_song_image}
                                    alt={song.name}
                                />
                                <p className="ml-4">{song.name}</p>
                            </div>
                            <p>{song.desc}</p>
                            <p className="text-right">{song.duration}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Playlist;

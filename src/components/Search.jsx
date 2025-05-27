import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { songsData } from "../assets/assets";
import { assets } from "../assets/assets";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from 'firebase/firestore'; 
import { PlayerContext } from "../context/PlayerContext";
import { SidebarContext } from "../context/NavbarContext";
import Account from "./Account";
const Search = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [songsWithPlayCount, setSongsWithPlayCount] = useState([]);
    const { playWithId } = useContext(PlayerContext); // Use PlayerContext for playWithId function

    document.body.dir = i18n.dir();

    // Fetch play count from Firestore
    useEffect(() => {
        const fetchPlayCount = async () => {
            try {
                const playCountCollection = collection(db, 'aswatalmaatem'); // Use the correct collection name
                const playCountSnapshot = await getDocs(playCountCollection);
                
                // Map Firestore data to an array with document IDs and play count
                const playCountData = playCountSnapshot.docs.map(doc => ({
                    id: doc.id,
                    playCount: doc.data().plays || 0 // Default to 0 if 'plays' field is missing
                }));

                // Combine play count with songs data
                const combinedData = songsData.map(song => {
                    const playData = playCountData.find(doc => doc.id === song.id.toString()); // Match document ID with song ID
                    return {
                        ...song,
                        playCount: playData ? playData.playCount : 0 // Set playCount to 0 if no data found
                    };
                });

                // Sort by play count in descending order
                combinedData.sort((a, b) => b.playCount - a.playCount);
                setSongsWithPlayCount(combinedData);

            } catch (error) {
                console.error("Error fetching play counts: ", error);
            }
        };

        fetchPlayCount();
    }, []);

    // Filter songs based on the search term. Show all songs if the search term is empty.
    const filteredSongs = (songsWithPlayCount || []).filter(item => 
        searchTerm === '' || 
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  // State to manage the sidebar visibility
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} />
            <Account/>
            <div className="w-full mt-5">
                <input 
                    className="w-full h-7 rounded-full bg-black px-3 py-4 placeholder:text-gray-400" 
                    placeholder={t('Search')}
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>
            <div className="grid grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                <p>
                    {t("title")}
                </p>
                <p>{t("artist")}</p>
                <p>{t('album')}</p>
                <img className="m-auto w-4" src={assets.clock_icon} alt="Clock Icon" />
            </div>
            <hr />
            {filteredSongs.map((item, index) => (
                <div 
                    onClick={() => playWithId(item.id)} 
                    key={index} 
                    className="grid grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] transition-colors duration-300 hover:bg-[#ffffff2b] cursor-pointer"
                >
                    <p className="text-white">
                        <img src={item.image} className="inline w-10 h-10 mr-5" alt="Album Art" />
                        {item.name}
                    </p>
                    <p className="text-[15px]">
                        {item.desc}
                    </p>
                    <p className="text-[15px]">
                        {item.albumN}
                    </p>
                    <p className="text-[15px] text-center">
                        {item.duration}
                    </p>
                </div>
            ))}
        </>
    );
};

export default Search;

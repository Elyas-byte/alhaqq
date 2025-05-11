import React, { useEffect, useState, useContext } from "react";
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';
import { songsData, albumsData } from "../assets/assets";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { db } from "../../firebaseConfig"; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import Account from "./Account";
import { AccountsContext } from "../context/AccountsContext";

const DisplayHome = () => {
    const { t, i18n } = useTranslation();
    const [songsWithPlayCount, setSongsWithPlayCount] = useState([]);
    document.body.dir = i18n.dir();
    const { unVisible } = useContext(AccountsContext)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Simulate loading time
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Adjust as needed
    }, []);

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
    // State to manage the sidebar visibility
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} />
            <Account />
            <div className="mb-4 ml-2" onClick={unVisible}>
                <h1 className="my-5 font-bold text-2xl">{t("f_albums")}</h1>
                <div className="flex overflow-auto ">
                    {albumsData.map((item, index) => (
                        <AlbumItem key={index} name={item.name} desc={item.desc} id={item.id} image={item.image} />
                    ))}
                </div>
                <h1 className="my-5 font-bold text-2xl">{t("t_latmiyas")}</h1>
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 flex justify-center items-center">
                            <div className="w-12 aspect-square rounded-full border-8 border-red-500 border-t-transparent animate-spin"></div>
                        </div>
                    )}
                    <div className={`flex overflow-auto ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        {songsWithPlayCount
                            .slice(0, 15)
                            .map((item, index) => (
                                <SongItem
                                    key={index}
                                    name={item.name}
                                    desc={item.desc}
                                    id={item.id}
                                    image={item.image}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DisplayHome;

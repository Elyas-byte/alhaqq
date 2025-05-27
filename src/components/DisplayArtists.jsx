import React, { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { albumsData, artistsData, assets, songsData } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { SidebarContext } from "../context/NavbarContext";
import AlbumItem from "./AlbumItem";
import { db } from "../../firebaseConfig"; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import SongItem from "./SongItem";


const DisplayArtist = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const {playWithId} =useContext(PlayerContext)
    const {id} = useParams();
    const [songsWithPlayCount, setSongsWithPlayCount] = useState([]);
    const artistData = artistsData[id]
    const albumData = albumsData[id]
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext); 

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


    return(
        <>
            <Navbar toggleSidebar={toggleSidebar} />
            
            <div className="relative h-72 md:h-96">
                <img 
                    className="absolute top-0 left-0 w-full h-[60%] object-cover rounded-md shadow-[3px_6px_4px_1px_rgba(0,0,0,0.25)] hidden md:block" 
                    src={artistData.banner} 
                    alt="Artist Banner" 
                />
                <div className="relative grid grid-cols-3 items-end max-w-6xl mx-auto p-6 md:p-10 gap-6">
                    <div className="col-span-2 flex items-center space-x-4">
                        <img 
                            className="mt-[15%] hidden md:block md:w-48 ml-4 rounded-lg shadow-[3px_6px_4px_1px_rgba(0,0,0,0.25)]" 
                            src={artistData.picture} 
                            alt={artistData.name} 
                        />
                        <div className="flex flex-col text-[#EAEAEA] mt-[25%]">
                            <h2 className="text-3xl md:text-5xl font-bold">{artistData.name}</h2>
                            <p className="mt-2 text-sm md:text-base">{artistData.followers} {t('followers')} - {artistData.albums} {t('albums')}</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="mt-4 bg-red-900 shadow-[3px_6px_4px_1px_rgba(0,0,0,0.25)] hover:bg-red-800 transition-colors duration-300 text-[#EAEAEA] py-2 px-4 rounded-full flex items-center">
                            <span className="mr-2 shadow-lg ">{t('p_all')}</span>
                            <img className="w-4 m-auto" src={assets.play_icon} alt="Play Icon"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Albums Section */}
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-[#EAEAEA] mb-6">{t('t_albums')}</h3>
                <div className="flex overflow-auto">
                    {albumsData.filter((album) => album.artist === artistData.id || album.artist2 === artistData.id || album.artist3 === artistData.id).map((album, index) => (
                        <AlbumItem key={index} image={album.image} name={album.name} desc={album.desc} id={album.id}/>
                    ))}
                </div>
            </div>


            {/* Songs List Section */}
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-[#EAEAEA] mb-6">{t('t_latmiyas')}</h3>
                <div className="flex overflow-auto">
                        {songsData
                            .filter((item) => item.desc === artistData.name)
                            .slice(0, 15) // Get top 15 files based on play count
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
        </>
    )
}

export default DisplayArtist;

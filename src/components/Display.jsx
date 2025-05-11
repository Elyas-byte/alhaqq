import React, { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import DisplayHome from "./DisplayHome";
import { Route,Routes, useLocation } from "react-router-dom";
import DisplayAlbum from "./DisplayAlbum";
import { albumsData } from "../assets/assets";
import Search from "./Search";
import DisplayArtist from "./DisplayArtists";
import { artistsData } from "../assets/assets";
import Library from "./Library";
import Signup from "./Signup";
import Queue from "./Queue";
import Playlist from './Playlist'
import Login from "./Login";
import LyricsFragment from "./Lyrics";
const Display = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();

    const displayRef = useRef()
    const location = useLocation()
    const isAlbum = location.pathname.includes("album")
    const albumId = isAlbum ? location.pathname.slice(-1) : ""
    const isArtist = location.pathname.includes("artist")
    const artistId = isArtist ? location.pathname.slice(-1) : ""
    const bgColor = isAlbum ? albumsData[Number(albumId)].bgColor : isArtist ? artistsData[Number(artistId)].color : "#F00707"
    useEffect(()=>{
        if (isAlbum || isArtist) {
            displayRef.current.style.background = `linear-gradient(${bgColor} 50%, #121212)`
        }else{
            displayRef.current.style.background = `#121212`
        }
    })

    return (
        <div ref={displayRef} className="w-[100%] z-2 m-2 px-6 pt-4 rounded bg-[#121212] text-[#EAEAEA] overflow-auto lg:w-[84%] ml-0">
            <Routes>
                <Route path="/" element={<DisplayHome/>} />
                <Route path="/album/:id" element={<DisplayAlbum/>} />
                <Route path="/search" element={<Search/>} />  
                <Route path="/artist/:id" element={<DisplayArtist/>}/>
                <Route path="/library" element={<Library />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/queue" element={<Queue />} />
                <Route path="/playlist/:id" element={<Playlist/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/lyrics" element={<LyricsFragment/>} />
            </Routes>
        </div>
    )
}

export default Display
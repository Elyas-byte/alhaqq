import React, { Fragment, useContext } from "react";
import { useTranslation } from 'react-i18next';
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { albumsData, assets, songsData } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { SidebarContext } from "../context/NavbarContext";
import Account from "./Account";

const DisplayAlbum = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const { playWithId } = useContext(PlayerContext)

    const { id } = useParams();
    const albumData = albumsData[id]
    const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext); // Use SidebarContext

    return (
        <>
            <Navbar toggleSidebar={toggleSidebar} />
            <Account />
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end text-[#EAEAEA]">
                <img className="w-48 h-48 rounded object-cover" src={albumData.image}></img>
                <div className="flex flex-col">
                    <p>{t("album")}</p>
                    <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumData.name}</h2>
                    <h4>{albumData.desc}</h4>
                    <p className="mt-1">
                        <img className="inline-block w-5" src={assets.alhaqq}></img>
                        <b> {t("name")}</b>
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                <p><b className="mr-4">#</b> {t("title")}</p>
                <p>Artist</p>
                <img className="m-auto w-4" src={assets.clock_icon}></img>
            </div>
            <hr />
            {
                songsData.filter(item => item.album === id).map((item, index) => (
                    <div onClick={() => playWithId(item.id)} key={index} className="grid grid-cols-3 gap-2 p-2 items-center text-[#a7a7a7] transition-colors duration-300 hover:bg-[#ffffff2b] cursor-pointer">
                        <p className="text-[#EAEAEA]">
                            <p className="mr-4 text-[#a7a7a7] inline">{index + 1}</p>
                            <img src={item.image} className="inline w-10 h-10 mr-5"></img>
                            {item.name}
                        </p>
                        <p className="text-[15px]">
                            {item.desc}
                        </p>
                        <p className="text-15px text-center">{item.duration}</p>
                    </div>
                ))
            }
        </>
    )
}

export default DisplayAlbum
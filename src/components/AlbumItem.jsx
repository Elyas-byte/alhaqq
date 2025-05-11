import React, { Fragment } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const AlbumItem = ({image, name, desc, id}) => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();

    const navigate = useNavigate()
    return(
        <div onClick={()=> navigate(`/album/${id}`)} className="min-w-[180px] p-2 px-3 rounded bg-[#191919] mx-1 cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]">
            <img className="rounded w-[156px] h-[156px] object-cover" src={image}></img>
            <p className="font-bold text-[#EAEAEA] mt-2 mb-1">{name}</p>
            <p className="text-[#A9A9A9] text-sm">{desc}</p>
        </div>
    )
}
export default AlbumItem
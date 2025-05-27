import React, { useContext, useState, useEffect } from "react";
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';
import { PlayerContext } from "../context/PlayerContext";
import MediaSession from '@mebtte/react-media-session';
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";

const Player = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const { seekBar, seekBg, playStatus, play, pause, track, time, previous, next, seekSong, volumeBg, volume, volumeBar, changeVolume, mute, isMute } = useContext(PlayerContext);
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser; // Get the current user
    const [isLiked, setIsLiked] = useState(false); // Track if the current song is liked

    useEffect(() => {
        const checkLikedStatus = async () => {
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const likedPlId = userDoc.data().likedPl; // Fetch the liked songs playlist ID
                    if (likedPlId) {
                        const likedPlaylistRef = doc(db, "playlists", likedPlId);
                        const likedPlaylistDoc = await getDoc(likedPlaylistRef);

                        if (likedPlaylistDoc.exists()) {
                            const likedSongs = likedPlaylistDoc.data().songs || []; // Fetch current liked songs
                            setIsLiked(likedSongs.includes(track.id)); // Check if the current track is in liked songs
                        }
                    }
                }
            }
        };

        checkLikedStatus(); // Run the check on component mount
    }, [user, track.id]); // Depend on user and track.id to check liked status

    const toggleLike = async () => {
        if (!user) {
            alert(t('Please log in to like songs.')); // Alert if user is not logged in (temporary alert)
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const likedPlId = userDoc.data().likedPl; // Get the liked songs playlist ID
            const likedPlaylistRef = doc(db, "playlists", likedPlId);
            const likedPlaylistDoc = await getDoc(likedPlaylistRef);
            
            if (likedPlaylistDoc.exists()) {
                const likedSongs = likedPlaylistDoc.data().songs || []; // Get the existing liked songs

                if (isLiked) {
                    // Remove song from liked songs
                    const updatedSongs = likedSongs.filter((songId) => songId !== track.id);
                    await updateDoc(likedPlaylistRef, { songs: updatedSongs });
                } else {
                    // Add song to liked songs
                    await updateDoc(likedPlaylistRef, { songs: [...likedSongs, track.id] });
                }
                
                setIsLiked(!isLiked); 
            }
        }
    };

    return (
        <div className="h-[10%] bg-[#0D0D0D] flex justify-between items-center text-white px-4">
            <div className="hidden lg:flex items-center gap-4">
                <img className="w-12 h-12" src={track.image}></img>
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc}</p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1 m-auto">
                <div className="flex gap-4">
                    <img className="w-6 cursor-pointer" src={assets.shuffle_icon} alt="" />
                    <img onClick={previous} className="w-6 cursor-pointer" src={assets.prev_icon} alt="" />
                    {playStatus ? <img onClick={pause} className="w-6 cursor-pointer" src={assets.pause_icon} alt="" /> : <img onClick={play} className="w-6 cursor-pointer" src={assets.play_icon} alt="" />}
                    <img onClick={next} className="w-6 cursor-pointer" src={assets.next_icon} alt="" />
                    <img className="w-6 cursor-pointer" src={assets.loop_icon} alt="" />
                </div>
                <div className="flex items-center gap-5">
                    <p>{time.currentTime.minute}:{time.currentTime.second}</p>
                    <div ref={seekBg} onClick={seekSong} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
                        <hr ref={seekBar} className="h-1 border-none w-0 bg-red-800 rounded-full transition-all duration-100" />
                    </div>
                    <p>{time.totalTime.minute}:{time.totalTime.second}</p>
                </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 opacity-75">
                <img 
                    onClick={toggleLike} 
                    className="w-5 cursor-pointer" 
                    src={isLiked ? assets.liked : assets.like_icon} 
                    alt="Like" 
                />
                <img onClick={() => {
                    if (!location.pathname.includes("queue")) {
                        navigate('/queue');
                    } else {
                        navigate(-1);
                    }
                }} className="w-5 cursor-pointer" src={assets.queue_icon} alt="" />
                <img onClick={() => {
                    if (!location.pathname.includes("queue")) {
                        navigate('/lyrics');
                    } else {
                        navigate(-1);
                    }
                }} className="w-5" src={assets.mic_icon} alt="" />
                <img className="w-5" src={assets.speaker_icon} alt="" />
                <img onClick={mute} className="w-5 cursor-pointer" src={isMute() ? assets.volume_icon : assets.mute} alt="" />
                <div ref={volumeBg} onClick={changeVolume} className="w-20 bg-slate-50 h-1 rounded cursor-pointer">
                    <hr ref={volumeBar} className="h-1 border-none w-[100%] bg-red-800 rounded-full transition-all duration-300" />
                </div>
                <img className="w-5" src={assets.mini_player_icon} alt="" />
                <img className="w-5" src={assets.zoom_icon} alt="" />
            </div>
            <MediaSession
                title={track.name}
                artist={track.artist}
                artwork={[{
                    src: track.image,
                    sizes: '96x96,128x128,192x192,256x256,384x384,512x512',
                    type: 'image/jpeg',
                }]}
                onPlay={play}
                onPause={pause}
                onPreviousTrack={previous}
                onNextTrack={next}
            />
        </div>
    );
};

export default Player;

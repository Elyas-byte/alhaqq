import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Update with your actual path

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();
    const volumeBg = useRef();
    const volumeBar = useRef();
    const [volume, setVolume] = useState(1);
    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: "00", minute: 0 },
        totalTime: { second: "00", minute: 0 }
    });
    const [queue, setQueue] = useState([songsData[0]]); // Initialize queue with the first song
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current index in the queue
    const [isMuted, setIsMuted] = useState(true);

    const updatePlayCount = async (id) => {
        const songRef = doc(db, "aswatalmaatem", id.toString());
        await setDoc(songRef, { plays: increment(1) }, { merge: true });
    };

    const play = async () => {
        try {
            await audioRef.current.play();
            setPlayStatus(true);
            await updatePlayCount(track.id); // Update play count when playing
        } catch (error) {
            console.error("Play error:", error); // Handle any errors while playing
        }
    };


    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    const playWithId = async (id) => {
        try {
            const newTrack = songsData[id];

            // Check if the track is already in the queue
            const isTrackInQueue = queue.some((song) => song.id === newTrack.id);

            // If the track is not already in the queue, add it at the current index
            if (!isTrackInQueue) {
                const updatedQueue = [
                    ...queue.slice(0, currentIndex + 1), // Songs before the currentIndex
                    newTrack, // The new track to play
                    ...queue.slice(currentIndex + 1) // Remaining songs
                ];
                setQueue(updatedQueue); // Update the queue with the new song in the correct position
            }

            setCurrentIndex(currentIndex + 1); // Move the index to the newly added track
            await setTrack(newTrack); // Set the new track as the current one
            await play(); // Play the track and update the play count
        } catch (error) {
            console.error("Error playing song or updating play count:", error);
        }
    };


    const previous = async () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            await setTrack(queue[newIndex]);
            await play(); // Call play to update play count
        }
    };

    const next = async () => {
        if (currentIndex < queue.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            await setTrack(queue[newIndex]); // Set the new track

            // Wait for the audio to be ready before playing
            audioRef.current.oncanplaythrough = async () => {
                try {
                    await play(); // Start playing the new track
                } catch (error) {
                    console.error("Error playing track:", error);
                }
            };

            audioRef.current.load(); // Load the new track
        } else {
            pause(); // If no more songs, pause the player
        }
    };



    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);
    };

    const mute = () => {
        if (audioRef.current.volume > 0) {
            setVolume(audioRef.current.volume);
            audioRef.current.volume = 0; // Mute the audio
            volumeBar.current.style.width = `${audioRef.current.volume * 100}%`;
            setIsMuted(false);
        } else {
            audioRef.current.volume = Math.min(volume, 1); // Restore volume
            volumeBar.current.style.width = `${Math.min(volume, 1) * 100}%`;
            setIsMuted(true); // Update muted state
        }
    };


    const changeVolume = (e) => {
        const newVolume = e.nativeEvent.offsetX / volumeBg.current.offsetWidth;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        volumeBar.current.style.width = `${newVolume * 100}%`;
        setIsMuted(true)
    };

    const addToQueue = (id) => {
        const songToAdd = songsData[id];
        if (!queue.includes(songToAdd)) {
            setQueue((prevQueue) => [...prevQueue, songToAdd]);
        }
    };

    const removeFromQueue = (id) => {
        const songToRemove = songsData[id];
        setQueue((prevQueue) => prevQueue.filter(song => song.id !== songToRemove.id));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";

                setTime({
                    currentTime: {
                        second: audioRef.current.currentTime % 60 < 10 ? '0' + Math.floor(audioRef.current.currentTime % 60) : Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: audioRef.current.duration % 60 < 10 ? '0' + Math.floor(audioRef.current.duration % 60) : Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                });

                // Automatically move to next song when current time exceeds duration
                if (audioRef.current.currentTime >= audioRef.current.duration && audioRef.current.duration > 0) {
                    next(); // Move to the next song
                }
            }
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [audioRef, currentIndex, queue]);


    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        next,
        previous,
        seekSong,
        volumeBg,
        volumeBar,
        volume,
        setVolume,
        mute,
        changeVolume,
        queue,
        setQueue,
        addToQueue,
        removeFromQueue,
        isMute: () => isMuted
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;

import { createContext, useRef, useState, useCallback } from "react";
import { songsData } from "../assets/assets";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "../../firebaseConfig";

/**
 * Context for player actions that don't change frequently.
 * This prevents unnecessary re-renders in components that only need
 * to trigger player actions but don't need real-time updates.
 */
export const PlayerActionsContext = createContext();

const PlayerActionsProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const volumeBg = useRef();
  const volumeBar = useRef();

  const [volume, setVolume] = useState(1);
  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [queue, setQueue] = useState([songsData[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const updatePlayCount = async (id) => {
    const songRef = doc(db, "aswatalmaatem", id.toString());
    await setDoc(songRef, { plays: increment(1) }, { merge: true });
  };

  const play = useCallback(async () => {
    try {
      await audioRef.current.play();
      setPlayStatus(true);
      await updatePlayCount(track.id);
    } catch (error) {
      console.error("Play error:", error);
    }
  }, [track.id]);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setPlayStatus(false);
  }, []);

  const playWithId = useCallback(
    async (id) => {
      try {
        const newTrack = songsData[id];
        const isTrackInQueue = queue.some((song) => song.id === newTrack.id);

        if (!isTrackInQueue) {
          const updatedQueue = [
            ...queue.slice(0, currentIndex + 1),
            newTrack,
            ...queue.slice(currentIndex + 1),
          ];
          setQueue(updatedQueue);
        }

        setCurrentIndex(currentIndex + 1);
        await setTrack(newTrack);
        await play();
      } catch (error) {
        console.error("Error playing song or updating play count:", error);
      }
    },
    [queue, currentIndex, play]
  );

  const previous = useCallback(async () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      await setTrack(queue[newIndex]);
      await play();
    }
  }, [currentIndex, queue, play]);

  const next = useCallback(async () => {
    if (currentIndex < queue.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      await setTrack(queue[newIndex]);

      audioRef.current.oncanplaythrough = async () => {
        try {
          await play();
        } catch (error) {
          console.error("Error playing track:", error);
        }
      };

      audioRef.current.load();
    } else {
      pause();
    }
  }, [currentIndex, queue, play, pause]);

  const seekSong = useCallback(async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  }, []);

  const mute = useCallback(() => {
    if (audioRef.current.volume > 0) {
      setVolume(audioRef.current.volume);
      audioRef.current.volume = 0;
      volumeBar.current.style.width = `${audioRef.current.volume * 100}%`;
      setIsMuted(false);
    } else {
      audioRef.current.volume = Math.min(volume, 1);
      volumeBar.current.style.width = `${Math.min(volume, 1) * 100}%`;
      setIsMuted(true);
    }
  }, [volume]);

  const changeVolume = useCallback((e) => {
    const newVolume = e.nativeEvent.offsetX / volumeBg.current.offsetWidth;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    volumeBar.current.style.width = `${newVolume * 100}%`;
    setIsMuted(true);
  }, []);

  const addToQueue = useCallback(
    (id) => {
      const songToAdd = songsData[id];
      if (!queue.includes(songToAdd)) {
        setQueue((prevQueue) => [...prevQueue, songToAdd]);
      }
    },
    [queue]
  );

  const removeFromQueue = useCallback((id) => {
    const songToRemove = songsData[id];
    setQueue((prevQueue) =>
      prevQueue.filter((song) => song.id !== songToRemove.id)
    );
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
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
    isMute: () => isMuted,
  };

  return (
    <PlayerActionsContext.Provider value={contextValue}>
      {props.children}
    </PlayerActionsContext.Provider>
  );
};

export default PlayerActionsProvider;

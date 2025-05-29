import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to handle player time updates in isolation.
 * This prevents the main PlayerContext from causing re-renders
 * in components that don't need time updates.
 */
export const usePlayerTime = (audioRef, playStatus) => {
  const [time, setTime] = useState({
    currentTime: { second: "00", minute: 0 },
    totalTime: { second: "00", minute: 0 },
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    if (playStatus && audioRef?.current) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setTime({
            currentTime: {
              second:
                audioRef.current.currentTime % 60 < 10
                  ? "0" + Math.floor(audioRef.current.currentTime % 60)
                  : Math.floor(audioRef.current.currentTime % 60),
              minute: Math.floor(audioRef.current.currentTime / 60),
            },
            totalTime: {
              second:
                audioRef.current.duration % 60 < 10
                  ? "0" + Math.floor(audioRef.current.duration % 60)
                  : Math.floor(audioRef.current.duration % 60),
              minute: Math.floor(audioRef.current.duration / 60),
            },
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audioRef, playStatus]);

  return time;
};

import { useContext, useState, useEffect } from "react";
import { PlayerActionsContext } from "../context/PlayerActionsContext";

/**
 * Isolated component that only handles time display updates.
 * This prevents the main Player component from re-rendering every second.
 */
const PlayerTimeDisplay = () => {
  const { audioRef, seekBar, seekBg, seekSong } =
    useContext(PlayerActionsContext);
  const [time, setTime] = useState({
    currentTime: { second: "00", minute: 0 },
    totalTime: { second: "00", minute: 0 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";

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

    return () => clearInterval(interval);
  }, [audioRef, seekBar]);

  return (
    <div className="flex items-center gap-5">
      <p>
        {time.currentTime.minute}:{time.currentTime.second}
      </p>
      <div
        ref={seekBg}
        onClick={seekSong}
        className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
      >
        <hr
          ref={seekBar}
          className="h-1 border-none w-0 bg-red-800 rounded-full transition-all duration-100"
        />
      </div>
      <p>
        {time.totalTime.minute}:{time.totalTime.second}
      </p>
    </div>
  );
};

export default PlayerTimeDisplay;

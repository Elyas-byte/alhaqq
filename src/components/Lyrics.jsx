import React, { useEffect, useState, useRef, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const LyricsFragment = () => {
    const { time, track } = useContext(PlayerContext);
    const [lyrics, setLyrics] = useState([]);
    const lyricsRef = useRef(null);
    const activeLyricRef = useRef(null);

    useEffect(() => {
        if (track?.lyrics) {
            setLyrics(track.lyrics);
        }
    }, [track]);

    useEffect(() => {
        if (!lyrics.length) return;

        const currentTimeSec = parseInt(time.currentTime.minute) * 60 + parseInt(time.currentTime.second);

        let activeIndex = lyrics.findIndex((lyric, index) => {
            const nextLyric = lyrics[index + 1];
            return nextLyric ? currentTimeSec >= lyric.time && currentTimeSec < nextLyric.time : currentTimeSec >= lyric.time;
        });

        if (activeIndex !== -1 && activeLyricRef.current !== lyrics[activeIndex].time) {
            activeLyricRef.current = lyrics[activeIndex].time;

            const activeLyricElement = document.getElementById(`lyric-${lyrics[activeIndex].time}`);
            if (activeLyricElement) {
                activeLyricElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [time, lyrics]);

    return (
        <div ref={lyricsRef} className="lyrics-container p-4 text-white h-full overflow-y-auto">
            {lyrics.map((lyric, index) => {
                // Convert current player time to total seconds
                const currentTimeSec = parseInt(time.currentTime.minute) * 60 + parseInt(time.currentTime.second);

                // Determine if this lyric is currently active
                const isActive = currentTimeSec >= lyric.time && (index === lyrics.length - 1 || currentTimeSec < lyrics[index + 1].time);

                return (
                    <p
                        key={lyric.time}
                        id={`lyric-${lyric.time}`}
                        className={`text-lg my-2 transition-all ${
                            isActive ? "text-white font-bold scale-105" : "text-gray-400 opacity-50"
                        }`}
                    >
                        {lyric.text}
                    </p>
                );
            })}
        </div>
    );
};

export default LyricsFragment;

import { createContext, useContext } from "react";
import { PlayerActionsContext } from "./PlayerActionsContext";
import { usePlayerTime } from "../hooks/usePlayerTime";

/**
 * Isolated context for player controls that need time updates.
 * This prevents other components from re-rendering due to time changes.
 */
export const PlayerControlsContext = createContext();

export const PlayerControlsProvider = ({ children }) => {
  const { audioRef, playStatus, seekBar, seekBg, seekSong } =
    useContext(PlayerActionsContext);
  const time = usePlayerTime(audioRef, playStatus);

  const contextValue = {
    time,
    seekBar,
    seekBg,
    seekSong,
  };

  return (
    <PlayerControlsContext.Provider value={contextValue}>
      {children}
    </PlayerControlsContext.Provider>
  );
};

export default PlayerControlsProvider;

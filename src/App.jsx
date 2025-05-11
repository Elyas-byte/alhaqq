import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import './i18n';
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";
import { SidebarContext } from "./context/NavbarContext"; // Import SidebarContext

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext); // Use SidebarContext

  return (
    <div className="h-screen bg-[#0D0D0D] relative">
      <div className="h-[90%] flex">
        {/* Sidebar visibility controlled by isSidebarOpen */}
        <Sidebar />
          <Display />
      </div>
      <Player />
      <audio ref={audioRef} src={track.file} preload="auto"></audio>

      {/* Overlay for dimming background when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-9"
          onClick={toggleSidebar} // Close sidebar on click
        ></div>
      )}
    </div>
  );
};

export default App;

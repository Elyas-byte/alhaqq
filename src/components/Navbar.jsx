import React, { useContext, useEffect, useState } from "react";
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../context/NavbarContext";
import { AccountsContext } from "../context/AccountsContext";
import { PlayerContext } from "../context/PlayerContext"; // Context for playing songs
import axios from 'axios';
import { db } from "../../firebaseConfig"; // Import Firestore database instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { songsData } from "../assets/assets"; // Songs data

const Navbar = () => {
  const { t, i18n } = useTranslation();

  document.body.dir = i18n.dir();
  const navigate = useNavigate();

  const [contextMenu, setContextMenu] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const { toggleAccountsVisibility } = useContext(AccountsContext);
  const { playWithId, addToQueue } = useContext(PlayerContext); // Use PlayerContext for playWithId function

  const [news, setNews] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search bar expansion
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [songsWithPlayCount, setSongsWithPlayCount] = useState([]); // State for songs with play count

  // Define RSS feed URLs for different languages
  const rssFeeds = {
    en: 'https://en.shafaqna.com/feed/',
    fa: 'https://fa.shafaqna.com/feed/', // Farsi
    ur: 'https://ur.shafaqna.com/feed/', // Urdu
    ar: 'https://ar.shafaqna.com/feed/'  // Arabic
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX + 2,
      mouseY: e.clientY - 6,
      id
    });
  };
  
  // Handle long press on mobile
  const handleTouchStart = (e, id) => {
    // Start the timer for long press
    setLongPressTimer(setTimeout(() => {
      handleContextMenu(e, id);
    }, 500)); // 500ms for long press
  };

  const handleTouchEnd = () => {
    // Clear the timer if touch ends before long press
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Handle click on options in the context menu
  const handleOptionClick = (option) => {
    const { id } = contextMenu; 
    if (option === 'play') {
      playWithId(id);
    } else if (option === 'queue') {
      addToQueue(id);
    }
    setContextMenu(null);
  };
  

  // Close context menu when clicking elsewhere
  const handleClickAway = () => {
    setContextMenu(null);
  };
  // Fetch the latest news based on the selected language
  useEffect(() => {
    const fetchNews = async () => {
      const currentLang = i18n.language; // Get the current language
      const rssUrl = rssFeeds[currentLang] || rssFeeds.en; // Default to English if no feed for current language

      try {
        const response = await axios.get('https://api.rss2json.com/v1/api.json', {
          params: { rss_url: rssUrl }
        });
        setNews(response.data.items);
      } catch (error) {
        console.error("Error fetching news: ", error);
      }
    };

    fetchNews();
  }, [i18n.language]); // Re-fetch news if the language changes

  // Fetch play count from Firestore
  useEffect(() => {
    const fetchPlayCount = async () => {
      try {
        const playCountCollection = collection(db, 'aswatalmaatem'); // Use the correct collection name
        const playCountSnapshot = await getDocs(playCountCollection);

        // Map Firestore data to an array with document IDs and play count
        const playCountData = playCountSnapshot.docs.map(doc => ({
          id: doc.id,
          playCount: doc.data().plays || 0 // Default to 0 if 'plays' field is missing
        }));

        // Combine play count with songs data
        const combinedData = songsData.map(song => {
          const playData = playCountData.find(doc => doc.id === song.id.toString()); // Match document ID with song ID
          return {
            ...song,
            playCount: playData ? playData.playCount : 0 // Set playCount to 0 if no data found
          };
        });

        // Sort by play count in descending order
        combinedData.sort((a, b) => b.playCount - a.playCount);
        setSongsWithPlayCount(combinedData);

      } catch (error) {
        console.error("Error fetching play counts: ", error);
      }
    };

    fetchPlayCount();
  }, []);

  // Toggle search bar visibility
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Handle search query input
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter songs based on the search query
  const filteredSongs = (songsWithPlayCount || []).filter(item =>
    searchQuery === '' ||
    (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="w-full flex justify-between items-center text-[#EAEAEA] font-semibold p-4">
        <div className="flex items-center gap-2 min-w-15">
          {/* Hamburger Menu */}
          <div
            onClick={toggleSidebar}
            className={`min-w-8 min-h-8 lg:hidden flex flex-col justify-center items-center cursor-pointer transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : ''}`}>
            <div className="min-w-[75%] h-[2px] rounded-md bg-[#EAEAEA] mb-1"></div>
            <div className="min-w-[75%] h-[2px] rounded-md bg-[#EAEAEA] mb-1"></div>
            <div className="min-w-[75%] h-[2px] rounded-md bg-[#EAEAEA]"></div>
          </div>

          {/* Back and Forward buttons */}
          <img onClick={() => navigate('/')} className="w-8 bg-black p-2 rounded-2xl cursor-pointer" src={assets.home_icon} />
          <img onClick={() => navigate(-1)} className="w-8 bg-black p-2 hidden md:block rounded-2xl cursor-pointer" src={assets.arrow_left} alt="Back" />
          <img onClick={() => navigate(1)} className="w-8 bg-black p-2 hidden md:block rounded-2xl cursor-pointer" src={assets.arrow_right} alt="Forward" />
        </div>

        {/* Marquee effect for latest Shafaqna news */}
        <div className="flex-grow mx-4 overflow-hidden max-w-[35%] lg:max-w-[70%]">
          <div className="relative overflow-hidden whitespace-nowrap">
            <marquee className="flex">
              {news.length > 0 ? (
                <>
                  {news.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline mx-4"
                    >
                      {item.title}
                    </a>
                  ))}
                  {/* Duplicate the news items for a smooth transition */}
                  {news.map((item, index) => (
                    <a
                      key={`duplicate-${index}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline mx-4"
                    >
                      {item.title}
                    </a>
                  ))}
                </>
              ) : (
                <p className="text-white">{t("loading_news")}</p>
              )}
            </marquee>
          </div>
        </div>

        {/* Search Button */}
        <img
          onClick={toggleSearch}
          className="w-8 h-8 bg-black p-2 rounded-2xl cursor-pointer"
          src={assets.search_icon} // Replace with your search icon asset
          alt="Search"
        />

        <div className="flex items-center gap-4">
          <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl cursor-pointer">{t("donate")}</p>
          <p className="bg-black text-[#EAEAEA] py-1 px-3 text-[15px] rounded-2xl cursor-pointer hidden md:block">{t("install")}</p>
          <p onClick={toggleAccountsVisibility} className="bg-red-200 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">E</p>
        </div>
      </div>

      <div
        className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out ${isSearchOpen ? 'w-[600px] opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'
          } z-50`}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="Search..."
          className={`px-4 py-2 border border-[#333333] rounded-lg focus:outline-none bg-[#191919] transition-all duration-500 ease-in-out ${isSearchOpen ? 'w-full' : 'w-0'
            }`}
        />
      </div>
      <div
        className={`fixed top-[35%] left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ease-in-out ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  z-20 w-[600px] bg-black p-4 rounded-lg`}
      >
        {filteredSongs.length > 0 ? (
          filteredSongs.map((item, index) => (
            <div
              key={index}
              className="text-white p-2 cursor-pointer hover:bg-[#333] rounded-lg transition-colors duration-300"
              onClick={() => playWithId(item.id)} // Play the song when clicked
              onContextMenu={(e) => handleContextMenu(e, item.id)}
              onTouchStart={(e) => handleTouchStart(e, item.id)}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex justify-between items-center">
                <span className="flex-shrink-0 w-1/3">{item.name}</span>
                <span className="flex-grow mx-2">{item.desc}</span>
                <span className="flex-shrink-0 w-1/4 text-right">{item.duration}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">{t("no_results")}</p>
        )}
      </div>
      {contextMenu && (
        <div
          className="fixed z-50 bg-[#2a2a2a] text-[#EAEAEA] rounded shadow-lg"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          <ul>
            <li
              onClick={() => handleOptionClick('play')}
              className="p-2 flex cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
            >
              <img src={assets.play_icon} className="w-6 h-6 mr-2" /> {t('play')}
            </li>
            <li
              onClick={() => handleOptionClick('queue')}
              className="p-2 flex cursor-pointer transition-colors duration-300 hover:bg-[#ffffff26]"
            >
              <img src={assets.queue_icon} className="w-6 h-6 mr-2" /> {t('a_q')}
            </li>
          </ul>
        </div>
      )}

      {/* Click away listener to close context menu */}
      {contextMenu && <div onClick={handleClickAway} onContextMenu={handleClickAway} className="fixed inset-0 z-40"></div>}
    </>
  );
};

export default Navbar;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import PlayerContextProvider from './context/PlayerContext.jsx';
import { SidebarProvider } from './context/NavbarContext.jsx'; 
import AccountsProvider from './context/AccountsContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider> 
        <PlayerContextProvider>
          <AccountsProvider>
            <DndProvider backend={HTML5Backend}> 
              <App />
            </DndProvider>
          </AccountsProvider>
        </PlayerContextProvider>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

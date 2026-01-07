import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { ApiProvider } from "@reduxjs/toolkit/query/react";

import { tmdbApi } from "@/services/TMDB";
import GlobalContextProvider from "@/context/globalContext";
import ThemeProvider from "@/context/themeContext";
import { WatchlistProvider } from "@/context/watchlistContext";
import { AudioProvider } from "@/context/audioContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiProvider api={tmdbApi}>
        <ThemeProvider>
          <AudioProvider>
            <WatchlistProvider>
              <GlobalContextProvider>
                <LazyMotion features={domAnimation}>
                  <App />
                </LazyMotion>
              </GlobalContextProvider>
            </WatchlistProvider>
          </AudioProvider>
        </ThemeProvider>
      </ApiProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

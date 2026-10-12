import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/responsive.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </BrowserRouter>
);
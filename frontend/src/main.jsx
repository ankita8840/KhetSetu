import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./i18n/index.js";
import { autoDetectLanguageFromLocation } from "./utils/languageDetect.js";
import "./index.css";

// Best-effort: refine the language choice using the browser's
// geolocation once permission is available. The UI renders immediately
// with the browser-language guess; this only upgrades it if a more
// specific regional language is detected and the person hasn't already
// picked one manually.
autoDetectLanguageFromLocation();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

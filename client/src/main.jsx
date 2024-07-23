import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { InstructionsProvider } from "./components/context/UserInstructions.jsx";
import { MainLibraryProvider } from "./components/context/MainLibraryContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainLibraryProvider>
      <InstructionsProvider>
        <App />
      </InstructionsProvider>
    </MainLibraryProvider>
  </React.StrictMode>
);

// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TimerProvider } from "./contexts/TimerContext";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TimerProvider>
      <App />
    </TimerProvider>
  </React.StrictMode>
);
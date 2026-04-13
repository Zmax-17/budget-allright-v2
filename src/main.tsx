import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/styles/styles.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./context/ThemeContext";

import App from "./App";
import ErrorBoundary from "./shared/components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Toaster
          position="bottom-left"
          toastOptions={{ duration: 3000 }}
        />

        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);

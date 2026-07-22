import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Belt-and-braces: surface any uncaught error as a visible banner instead of
// a silent blank page, so it can be screenshotted and fixed.
function showFatal(msg: string) {
  if (document.getElementById("nc-fatal")) return;
  const el = document.createElement("div");
  el.id = "nc-fatal";
  el.style.cssText =
    "position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#7a1d1d;color:#fff;" +
    "font:13px/1.5 monospace;padding:10px 14px;white-space:pre-wrap;word-break:break-word;";
  el.textContent = "⚠ Site error (screenshot this): " + msg;
  document.body.appendChild(el);
}
window.addEventListener("error", (e) => showFatal(e.message || String(e.error)));
window.addEventListener("unhandledrejection", (e) =>
  showFatal("Promise: " + (e.reason?.message || String(e.reason)))
);

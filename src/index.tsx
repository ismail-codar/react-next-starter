import * as React from "react";
import { render } from "react-dom";
import App from "./app";

// https://webpack.js.org/guides/progressive-web-application/
// https://developers.google.com/web/tools/workbox/guides/codelabs/webpack
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(registrationError => {
      console.log("SW registration failed: ", registrationError);
    });
  });
}
let manifest = document.createElement("link");
manifest.rel = "manifest";
manifest.href = "/manifest.json";
document.head.appendChild(manifest);

const root = document.createElement("div");
document.body.appendChild(root);
render(<App />, root);

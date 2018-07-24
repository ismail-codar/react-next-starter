import * as React from "react";
import { render } from "react-dom";
import App from "./app";
import DemoApp from "../app-packages/sis/utils/demo-utils";

const activeDemo = require("../scripts/_demo");

const root = document.createElement("div");
root.id = "main";
document.body.appendChild(root);

if (activeDemo) {
  render(<DemoApp demo={activeDemo} />, root);
} else {
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
  render(<App />, root);
}

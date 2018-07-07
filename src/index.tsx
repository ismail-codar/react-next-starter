import * as React from "react";
import { render } from "react-dom";
import App from "./app";

// https://webpack.js.org/guides/progressive-web-application/
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then(registration => {
//         console.log("SW registered: ", registration);
//       })
//       .catch(registrationError => {
//         console.log("SW registration failed: ", registrationError);
//       });
//   });
// }

const root = document.createElement("div");
document.body.appendChild(root);
render(<App />, root);

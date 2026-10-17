import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

setTimeout(() => {
  console.log('%cStop!', 'color:red; font-size:40px; font-weight:bold');
  console.log('This console is not appropriate for you to use, please close it.');
}, 3000);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
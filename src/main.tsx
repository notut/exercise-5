import React from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure index.html has <div id='root'></div>",
  );
}

createRoot(rootElement).render(<h1>Hello React</h1>);

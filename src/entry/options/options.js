import React from "react";
import { createRoot } from "react-dom/client";
import "@/style/default.less";
import "@/style/options.less";

function Options() {
  return (
    <div id="options">
      <nav>
        <div></div>
        <ul></ul>
      </nav>
      <main></main>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Options />);

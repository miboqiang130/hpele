import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@/style/default.less";
import "@/style/options.less";
import Css from "./components/css";
import Javascript from "./components/javascript";
import Websites from "./components/websites";
import API from "@/script/api";

const routes = ["样式", "脚本"];

function Options() {
  const [content, setContent] = useState("样式");
  const [storage, setStorage] = useState({});

  useEffect(() => {
    API.getData().then(rsp => {
      setStorage(rsp);
    });
  }, []);

  return (
    <div id="options" className="flex">
      <nav>
        <header>
          <img height="32" src="/image/icon32.png" />
          <b>HPELE</b>
        </header>
        <Websites data={storage.websites || []} />
      </nav>
      <main className="flex-1">
        <div className="top card">
          <ul className="mjdzt">
            {routes.map(i => (
              <li
                key={i}
                onClick={() => setContent(i)}
                className={content === i ? "active" : ""}>
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="content">
          {content === "样式" ? <Css /> : <Javascript />}
        </div>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Options />);

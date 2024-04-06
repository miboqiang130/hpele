import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/style/default.less";
import "@/style/options.less";
import Css from "./components/css";
import Javascript from "./components/javascript";
import Websites from "./components/websites";
import API from "@/script/api";

const routes = [
  { id: "style", label: "样式" },
  { id: "script", label: "脚本" },
];

function Options() {
  const [websiteList, setWebsiteList] = useState([]);
  const [tab, setTab] = useState(routes[0]);
  const [curWebsiteId, setCurWebsiteId] = useState(null);
  const website = websiteList.find(i => i.id === curWebsiteId);

  useEffect(() => {
    API.getData(["websiteList"]).then(({ websiteList }) => {
      setWebsiteList(websiteList || []);
      if (websiteList.length > 0) setCurWebsiteId(websiteList[0].id);
    });
  }, []);

  const dispatch = task => {
    switch (task.type) {
      case "select": {
        return setCurWebsiteId(task.id);
      }
      case "updateRemoveList": {
        return API.updateRemoveList(task.id, task.data).then(setWebsiteList);
      }
      case "updateStyleCode": {
        return API.updateStyleCode(task.id, task.code).then(setWebsiteList);
      }
      case "updateJs": {
        return API.updateJs(task.id, task.code).then(setWebsiteList);
      }
    }
  };

  return (
    <div id="options" className="flex">
      <nav>
        <header>
          <img height="32" src="/image/icon32.png" />
          <b>HPELE</b>
        </header>
        <Websites dispatch={dispatch} curWebsiteId={curWebsiteId} websiteList={websiteList} />
      </nav>
      <main className="flex-1">
        <div className="top card">
          <ul className="mjdzt">
            {routes.map((i, index) => (
              <li key={index} onClick={() => setTab(i)} className={tab.id === i.id ? "active" : ""}>
                {i.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="content">
          {tab.id === "style" ? <Css data={website} dispatch={dispatch} /> : <Javascript data={website} dispatch={dispatch} />}
        </div>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Options />);

import "@/style/default.less";
import "@/style/options.less";
import { useEffect, useState } from "react";
import { ConfigProvider, theme, App } from "antd";
import { createRoot } from "react-dom/client";
import Css from "./components/css";
import Javascript from "./components/javascript";
import Websites from "./components/websites";
import API from "@/script/api";
import bw from "@/script/browser";

window.top.gm = bw.i18n.getMessage;

const routes = [
  { id: "style", label: gm("tagStyle") },
  { id: "script", label: gm("tagScript") },
];

function Options() {
  const [websiteList, setWebsiteList] = useState([]);
  const [tab, setTab] = useState(routes[0]);
  const [curWebsiteId, setCurWebsiteId] = useState(null);
  const website = websiteList.find(i => i.id === curWebsiteId);

  useEffect(() => {
    dispatch();
    bw.storage.local.onChanged?.addListener(change => {
      if (change.websiteList) setWebsiteList(change.websiteList.newValue);
    });
  }, []);

  const dispatch = task => {
    switch (task?.type) {
      case "select": {
        return setCurWebsiteId(task.id);
      }
      case "deleteWebsite": {
        const newList = websiteList.filter(i => i.id !== task.id);
        return API.setData({ websiteList: newList });
      }
      default: {
        return API.getData(["websiteList"]).then(({ websiteList }) => {
          setWebsiteList(websiteList || []);
          if (websiteList?.length > 0) setCurWebsiteId(websiteList[0].id);
        });
      }
    }
  };

  return (
    <div id="options" className="flex">
      <nav>
        <header className="mjdzt">
          <img height="32" src="/image/icon32.png" />
          <b>HPELE</b>
        </header>
        <Websites dispatch={dispatch} curWebsiteId={curWebsiteId} websiteList={websiteList} />
      </nav>
      {website ? (
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
      ) : (
        <main className="flex-1">
          <div className="no-select">{gm("emptyNoSel")}</div>
        </main>
      )}
    </div>
  );
}
// 自定义antd主题
const customTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorText: "#888ea8",
    colorTextLabel: "#888ea8",
    colorTextHeading: "#d1d5db",
    colorTextDescription: "#6b7280",
    colorBgElevated: "#0d1117",
    colorBgContainer: "#161b22",
    colorBorder: "#1b2e4b",
  },
  components: { Form: { labelColor: "#d1d5db" }, Button: { defaultGhostColor: "#41454b", defaultGhostBorderColor: "#41454b" } },
};

// 挂载
const root = createRoot(document.getElementById("app"));
root.render(
  <ConfigProvider theme={customTheme}>
    <App style={{ height: "100%" }}>
      <Options />
    </App>
  </ConfigProvider>
);

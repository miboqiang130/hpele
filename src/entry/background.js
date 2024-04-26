import bw from "@/script/browser";
import API from "@/script/api";

bw.runtime.onInstalled.addListener(() => {
  API.setData({
    removeCss: `{
      position: absolute;
      right: 100vw;
      top: 100vh;
      display: none;
      opacity: 0;
      z-index: -1;
      width: 0px;
      height: 0;
      overflow: hidden;
    }`,
    websiteList: [],
  });
});

const onUpdated = async function (tabId, changeInfo, tab) {
  if (changeInfo.status !== "loading") return;
  const { websiteList } = await API.getWebsiteList();
  const { removeCss } = await API.getConfig();
  const index = websiteList?.findIndex(i => new RegExp("^" + i.host).test(tab.url));
  if (index >= 0 && websiteList[index].isEnable) {
    const ws = websiteList[index];
    Object.assign(ws, { title: tab.title, icon: tab.favIconUrl });
    API.setWebsiteList(websiteList);
    bw.scripting.insertCSS({
      css: ws.style.removeList.join(",") + removeCss + ws.style.code,
      target: { tabId },
    });
  }
};

bw.tabs.onUpdated.addListener(onUpdated);

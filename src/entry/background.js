import bw from "@/script/browser";
import API from "@/script/api";

const onUpdated = async function (tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete") return;
  const { websiteList } = await API.getWebsiteList();
  const { removeCss } = await API.getConfig();
  const index = websiteList.findIndex(i => tab.url.startsWith(i.host));
  console.log(websiteList, index);
  if (index >= 0) {
    Object.assign(websiteList[index], { title: tab.title, icon: tab.favIconUrl });
    API.setWebsiteList(websiteList);
    bw.scripting.insertCSS({
      css: websiteList[index].style.removeList.join(",") + removeCss,
      target: { tabId },
    });
  }
};

bw.tabs.onUpdated.addListener(onUpdated);

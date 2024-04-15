import "@/style/default.less";
import "@/style/popup.less";
import { createRoot } from "react-dom/client";
import bw from "@/script/browser";

function Popup() {
  return (
    <div id="popup">
      <ul>
        <li className="hide">选择移除项</li>
        <li className="hide">设置当前网站</li>
        <li
          onClick={() => {
            bw.runtime.openOptionsPage();
          }}>
          设置
        </li>
      </ul>
    </div>
  );
}

// 挂载
const root = createRoot(document.getElementById("app"));
root.render(<Popup />);

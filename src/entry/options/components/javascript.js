import MonacoEditor from "./monacoEditor";
import { App, Result } from "antd";
import bw from "@/script/browser";
import instructionPng from "@/assets/img/instruction.png";
import API from "@/script/api";

const defaultComment = `/**
 * 请输入你想要注入的JavaScript代码
 */
`;

function isUserScriptsAvailable() {
  try {
    bw.userScripts;
    return true;
  } catch {
    return false;
  }
}

export default function ({ data, dispatch }) {
  const { message } = App.useApp();
  const onSave = code => {
    dispatch({ type: "updateJs", data, code });
    API.updateJs(data, code);
    message.success("保存成功");
  };
  const isAvailable = isUserScriptsAvailable();
  return (
    <div className="card" id="javascript">
      <h3>注入js代码</h3>
      {isAvailable ? (
        <div className="editor-box">
          <MonacoEditor language="javascript" value={data.script.code || defaultComment} onSave={onSave} />
        </div>
      ) : (
        <Result
          status="403"
          title="注意"
          subTitle="未打开扩展开发者模式时无法使用js代码注入，请先打开下方指示的开发者模式的开关"
          extra={<img src={instructionPng} alt="instruction" />}
        />
      )}
    </div>
  );
}

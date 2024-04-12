import MonacoEditor from "./monacoEditor";
import { message } from "antd";
import bw from "@/script/browser";

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
  const onSave = code => {
    dispatch({ type: "updateJs", id: data.id, code });
    message.success("保存成功");
  };
  const isAvailable = isUserScriptsAvailable();
  return (
    <div className="card" id="javascript">
      <h3>注入js代码{info}</h3>
      {isAvailable ? (
        <div className="editor-box">
          <MonacoEditor language="javascript" value={data.script.code || defaultComment} onSave={onSave} />
        </div>
      ) : (
        <small>注意：未打开扩展开发者模式时无法使用js代码注入</small>
      )}
    </div>
  );
}

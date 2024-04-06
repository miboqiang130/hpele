import MonacoEditor from "./monacoEditor";
import { message } from "antd";

const defaultComment = `/**
 * 请输入你想要注入的JavaScript代码
 */
`;
export default function ({ data, dispatch }) {
  const onSave = code => {
    dispatch({ type: "updateJs", id: data.id, code });
    message.success("保存成功");
  };
  return (
    <div className="card" id="javascript">
      <h3>注入js代码</h3>
      <div className="editor-box">
        <MonacoEditor language="javascript" value={data.script.code || defaultComment} onSave={onSave} />
      </div>
    </div>
  );
}

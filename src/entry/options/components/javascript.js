import MonacoEditor from "./monacoEditor";

const defaultComment = `/**
 * 请输入你想要注入的JavaScript代码
 */
`;
export default function ({ data }) {
  return (
    <div className="card" id="javascript">
      <h3>注入js代码</h3>
      <div className="editor-box">
        <MonacoEditor language="javascript" value={data.script.code || defaultComment} />
      </div>
    </div>
  );
}

import MonacoEditor from "./monacoEditor";

export default function () {
  return (
    <div className="card" id="javascript">
      <h3>注入js代码</h3>
      <div className="editor-box">
        <MonacoEditor language="javascript" />
      </div>
    </div>
  );
}

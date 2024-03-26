import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React, { useEffect } from "react";

export default function ({ language, onSave }) {
  const editorDom = React.useRef(null);
  let editor;
  useEffect(() => {
    editor = monaco.editor.create(editorDom.current, {
      value: `const foo = () => 0;`,
      language: "language",
      theme: "vs-dark",
    });
  }, []);
  return <div ref={editorDom}></div>;
}

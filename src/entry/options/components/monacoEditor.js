import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import * as prettier from "prettier/standalone";
import cssPlugin from "prettier/plugins/postcss";
import jsPlugin from "prettier/plugins/babel";
import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import FullScreenSvg from "@/assets/svg/fullScreen.svg";
import FormatSvg from "@/assets/svg/format.svg";
import ResetSvg from "@/assets/svg/reset.svg";

export default function ({ value, language, onSave }) {
  const [editor, setEditor] = useState(null);
  const editorDom = React.useRef(null);
  useEffect(() => {
    setEditor(
      monaco.editor.create(editorDom.current, {
        value,
        language,
        theme: "vs-dark",
      }),
    );
    editorDom.current.onfullscreenchange = function () {
      editor.layout();
    };
  }, []);

  // 格式化代码
  const format = async () => {
    const value = editor.getValue();
    const newValue = await prettier.format(value, {
      parser: language,
      plugins: [cssPlugin, jsPlugin],
    });
    editor.setValue(newValue);
  };

  // 重置代码
  const resetCode = () => {
    editor.setValue(value);
  };

  return (
    <div className="editor-container flex">
      <div className="editor-header flex flex-middle">
        <span className="mjdzt margin-right-auto">{language}</span>
        <Tooltip title="格式化">
          <FormatSvg height="22" className="format" onClick={format} />
        </Tooltip>
        <Tooltip title="重置">
          <ResetSvg height="18" onClick={resetCode} />
        </Tooltip>
        <Tooltip title="全屏">
          <FullScreenSvg
            height="14"
            onClick={() => editorDom.current.requestFullscreen()}
          />
        </Tooltip>
        <button className="save-btn">保存</button>
      </div>
      <div className="editor" ref={editorDom}></div>
    </div>
  );
}

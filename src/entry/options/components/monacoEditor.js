import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect, useState, useRef } from "react";
import { Tooltip } from "antd";
import { formatCode } from "@/script/utils";
import FullScreenSvg from "@/assets/svg/fullScreen.svg";
import FormatSvg from "@/assets/svg/format.svg";
import ResetSvg from "@/assets/svg/reset.svg";

export default function ({ value, language, onSave }) {
  const [editor, setEditor] = useState(null);
  const editorDom = useRef(null);
  useEffect(() => {
    const ed = monaco.editor.create(editorDom.current, {
      value,
      language,
      theme: "vs-dark",
    });
    ed.addAction({
      id: "save-code",
      label: "save",
      keybindings: [monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyMod.KEY_S)],
      run: function () {
        onSave(ed.getValue());
      },
    });

    setEditor(ed);
    editorDom.current.onfullscreenchange = function () {
      ed.layout();
    };
  }, []);
  useEffect(() => {
    editor?.setValue(value);
  }, [value]);

  // 重置代码
  const resetCode = () => {
    editor.setValue(value || "");
  };

  return (
    <div className="editor-container flex">
      <div className="editor-header flex flex-middle">
        <span className="mjdzt margin-right-auto">{language}</span>
        <Tooltip title={gm("btnFormat")}>
          <FormatSvg
            height="22"
            className="format"
            onClick={() => {
              formatCode(language, editor.getValue()).then(rsp => editor.setValue(rsp));
            }}
          />
        </Tooltip>
        <Tooltip title={gm("btnReset")}>
          <ResetSvg height="18" onClick={resetCode} />
        </Tooltip>
        <Tooltip title={gm("btnFullScreen")}>
          <FullScreenSvg height="14" onClick={() => editorDom.current.requestFullscreen()} />
        </Tooltip>
        <button className="save-btn" onClick={() => onSave(editor.getValue())}>
          {gm("btnSave")}
        </button>
      </div>
      <div className="editor" ref={editorDom}></div>
    </div>
  );
}

import MonacoEditor from "./monacoEditor";
import { Button, Drawer, Input, App, Dropdown, Empty } from "antd";
import { useState } from "react";
import EmptySvg from "@/assets/svg/empty.svg?url";
import DeleteSvg from "@/assets/svg/delete.svg";
import API from "@/script/api";

export default function ({ data, dispatch }) {
  const { message } = App.useApp();
  const list = data?.style?.removeList || [];
  const [drawer, setDrawer] = useState(false);
  const [newTextarea, setNewTextarea] = useState("");
  const removeList = list.map((i, index) => (
    <div className="item" key={index}>
      {i}
      <DeleteSvg
        className="delete"
        height="16"
        onClick={() =>
          API.updateRemoveList(
            data.id,
            list.filter(item => item !== i)
          )
        }
      />
    </div>
  ));

  // 代码保存
  const onSave = code => {
    API.updateStyleCode(data.id, code);
    message.success(gm("noticeSaveSuc"));
  };

  return (
    <div id="css" className="flex">
      <div className="card remove-list flex">
        <h3>{gm("titleRemoveList")}</h3>
        {list?.length > 0 ? (
          <div className="items flex-1">{removeList}</div>
        ) : (
          <Empty
            className="no-remove-list column-middle"
            image={EmptySvg}
            imageStyle={{ height: 100 }}
            description={<span>{gm("empty")}</span>}></Empty>
        )}
        <div className="new-item">
          <Button type="primary" size="large" block icon={<big>+</big>} onClick={() => setDrawer(true)}>
            {gm("btnNew")}
          </Button>
        </div>
        <Drawer
          className="new-drawer"
          height={280}
          placement="bottom"
          closable={false}
          mask={false}
          open={drawer}
          getContainer={false}
          style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
          <Input.TextArea
            value={newTextarea}
            className="textarea"
            placeholder={gm("formRomovePlaceholder")}
            style={{ background: "#161b22", resize: "none" }}
            onChange={e => setNewTextarea(e.target.value)}
          />
          <div className="operate">
            <span
              onClick={() => {
                setDrawer(false);
                setNewTextarea("");
              }}>
              {gm("btnCancel")}
            </span>
            <span
              className="blue"
              onClick={() => {
                const text = newTextarea.trim();
                const newList = text.split("\n").concat(list || []);
                if (text) {
                  API.updateRemoveList(data.id, newList);
                  setDrawer(false);
                  setNewTextarea("");
                }
              }}>
              {gm("btnSave")}
            </span>
          </div>
        </Drawer>
      </div>
      <div className="card custom-css flex-1">
        <h3>{gm("titleCustomStyle")}</h3>
        <div className="editor-box">
          <MonacoEditor className="editor-dom" language="css" value={data?.style?.code || gm("defaultStyle")} onSave={onSave} />
        </div>
      </div>
    </div>
  );
}

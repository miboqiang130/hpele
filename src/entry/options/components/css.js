import MonacoEditor from "./monacoEditor";
import { Button, Drawer, Input, App, Dropdown } from "antd";
import { useState } from "react";

const defaultComment = `/**
 * 请输入你的自定义样式
 * 支持less语法
 */
`;

export default function ({ data, dispatch }) {
  const { message } = App.useApp();
  const list = data?.style?.removeList || [];
  const [drawer, setDrawer] = useState(false);
  const [newTextarea, setNewTextarea] = useState("");
  const removeList = list.map((i, index) => (
    <Dropdown
      key={index}
      menu={{
        items: [
          {
            key: "1",
            label: <span className="mjdzt">删除</span>,
            onClick: () => dispatch({ id: data.id, type: "updateRemoveList", data: list.filter(item => item !== i) }),
          },
        ],
      }}
      trigger={["contextMenu"]}>
      <div className="item">{i}</div>
    </Dropdown>
  ));

  // 代码保存
  const onSave = code => {
    dispatch({ type: "updateStyleCode", id: data.id, code });
    message.success("保存成功");
  };

  return (
    <div id="css" className="flex">
      <div className="card remove-list flex">
        <h3>移除列表</h3>
        <div className="items flex-1">{removeList}</div>
        <div className="new-item">
          <Button type="primary" size="large" block icon={<big>+</big>} onClick={() => setDrawer(true)}>
            新增一个
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
            placeholder="请输入要新增的选择器，回车区分多个选择器"
            style={{ background: "#161b22", resize: "none" }}
            onChange={e => setNewTextarea(e.target.value)}
          />
          <div className="operate">
            <span
              className="blue"
              onClick={() => {
                const text = newTextarea.trim();
                const newList = text.split("\n").concat(list || []);
                if (text) {
                  dispatch({ type: "updateRemoveList", id: data.id, data: newList });
                  setDrawer(false);
                  setNewTextarea("");
                }
              }}>
              确定
            </span>
            <span
              onClick={() => {
                setDrawer(false);
                setNewTextarea("");
              }}>
              取消
            </span>
          </div>
        </Drawer>
      </div>
      <div className="card custom-css flex-1">
        <h3>自定义样式</h3>
        <div className="editor-box">
          <MonacoEditor className="editor-dom" language="less" value={data?.style?.code || defaultComment} onSave={onSave} />
        </div>
      </div>
    </div>
  );
}

import MonacoEditor from "./monacoEditor";
import { Button, Drawer, Input } from "antd";
import NewSvg from "@/assets/svg/new.svg";
import { useState } from "react";

const defaultComment = `/**
 * 请输入你的自定义样式
 * 支持less语法
 */`;

export default function () {
  const [drawer, setDrawer] = useState(false);
  return (
    <div id="css" className="flex">
      <div className="card remove-list flex">
        <h3>移除列表</h3>
        <div className="items flex-1"></div>
        <div className="new-item">
          <Button
            type="primary"
            size="large"
            block
            icon={<big>+</big>}
            onClick={() => setDrawer(true)}>
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
          getContainer={false}>
          <Input.TextArea
            className="textarea"
            placeholder="请输入要新增的选择器，回车区分多个选择器"
            style={{ background: "#161b22", resize: "none" }}
          />
          <div className="operate">
            <span className="blue">确定</span>
            <span onClick={() => setDrawer(false)}>取消</span>
          </div>
        </Drawer>
      </div>
      <div className="card custom-css flex-1">
        <h3>自定义样式</h3>
        <div className="editor-box">
          <MonacoEditor
            className="editor-dom"
            language="less"
            value={defaultComment}
          />
        </div>
      </div>
    </div>
  );
}

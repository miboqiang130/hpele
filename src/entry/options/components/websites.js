import { memo, useRef, useState, useEffect } from "react";
import { Tooltip, Dropdown, Modal, Input, message } from "antd";
import API from "@/script/api";
import InputModule from "./InputModule";
import MoreSvg from "@/assets/svg/more.svg";
import NewSvg from "@/assets/svg/new.svg";
import ImportSvg from "@/assets/svg/import.svg";
import ExportSvg from "@/assets/svg/export.svg";
import SyncSvg from "@/assets/svg/sync.svg";
import SettingSvg from "@/assets/svg/setting.svg";

const WebsiteItem = memo(function ({ data, curWebsiteId, dispatch }) {
  return (
    <li className={data.id === curWebsiteId ? "active" : ""} onClick={() => dispatch({ type: "select", id: data.id })}>
      <div className="website-title" title={data.title}>
        <img src={data.icon} alt="icon" />
        <b>{data.title}</b>
      </div>
      <a href={data.host} target="_blank">
        {data.host}
      </a>
    </li>
  );
});

export default function ({ dispatch, curWebsiteId, websiteList }) {
  const [newModal, setNewModal] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [removeCss, setRemoveCss] = useState();
  const inputRef = useRef(null);

  const items = (websiteList || []).map((item, index) => <WebsiteItem key={index} data={item} dispatch={dispatch} curWebsiteId={curWebsiteId} />);

  // 导出数据
  const exportData = async () => {
    const data = await API.getData();
    bw.downloads.download({
      url: "data:application/json," + JSON.stringify(data),
      filename: "export.json",
    });
  };
  const handleOk = () => {};
  const handleCancel = () => {
    setNewModal(false);
  };

  return (
    <div className="website-list">
      <h3 className="flex flex-middle">
        <span className="margin-right-auto">网站列表</span>
        <InputModule ref={inputRef} />
        <Tooltip title="新增网站">
          <NewSvg height="16" onClick={() => setNewModal(true)} />
        </Tooltip>
        <Tooltip title="设置">
          <SettingSvg
            height="18"
            onClick={() => {
              API.getConfig().then(({ removeCss }) => {
                setRemoveCss(removeCss);
                setSettingModal(true);
              });
            }}
          />
        </Tooltip>
        <Dropdown
          menu={{
            items: [
              {
                key: 1,
                label: <span>导入数据</span>,
                icon: <ImportSvg height="20" width="20" />,
                onClick: () => {
                  inputRef.current.click();
                },
              },
              {
                key: 2,
                label: <span>导出数据</span>,
                icon: <ExportSvg />,
                onClick: exportData,
              },
              {
                key: 3,
                label: <span>与云端同步</span>,
                icon: <SyncSvg />,
              },
            ],
          }}>
          <MoreSvg height="16" />
        </Dropdown>
      </h3>
      <ul>{items}</ul>

      <Modal
        title="新增网站"
        open={newModal}
        onOk={handleOk}
        okText="确定"
        onCancel={handleCancel}
        cancelText="取消"
        okButtonProps={{ ghost: true }}
        cancelButtonProps={{ ghost: true }}
        closable={false}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Modal
        title="设置"
        open={settingModal}
        okText="确定"
        cancelText="取消"
        onOk={() => {
          setSettingModal(false);
          API.setConfig(removeCss).then(() => message.success("设置成功"));
        }}
        onCancel={() => setSettingModal(false)}
        okButtonProps={{ ghost: true }}
        cancelButtonProps={{ ghost: true }}
        closable={false}>
        <Input.TextArea
          value={removeCss}
          rows={4}
          className="textarea"
          placeholder="请输入"
          style={{ background: "#161b22", resize: "none" }}
          onChange={e => setRemoveCss(e.target.value)}
        />
      </Modal>
    </div>
  );
}

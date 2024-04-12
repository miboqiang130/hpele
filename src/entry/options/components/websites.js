import { memo, useRef, useState } from "react";
import { Tooltip, Dropdown, Modal, Input, Form, App } from "antd";
import API from "@/script/api";
import InputModule from "./InputModule";
import MoreSvg from "@/assets/svg/more.svg";
import NewSvg from "@/assets/svg/new.svg";
import ImportSvg from "@/assets/svg/import.svg";
import ExportSvg from "@/assets/svg/export.svg";
import SyncSvg from "@/assets/svg/sync.svg";
import SettingSvg from "@/assets/svg/setting.svg";
import UrlSvg from "@/assets/svg/url.svg?url";

const WebsiteItem = memo(function ({ data, curWebsiteId, dispatch, onEdit }) {
  const { message } = App.useApp();
  return (
    <Dropdown
      menu={{
        items: [
          // { label: <span className="mjdzt">禁用</span>, key: "0" },
          { label: <span className="mjdzt">编辑</span>, key: "1", onClick: onEdit },
          {
            label: <span className="mjdzt">删除</span>,
            key: "2",
            onClick: () => {
              dispatch({ type: "deleteWebsite", id: data.id }).then(() => {
                message.success("删除成功");
              });
            },
          },
        ],
      }}
      trigger={["contextMenu"]}>
      <li className={data.id === curWebsiteId ? "active" : ""} onClick={() => dispatch({ type: "select", id: data.id })}>
        <div className="website-title" title={data.title}>
          <img src={data.icon} alt="icon" onError={e => (e.target.src = UrlSvg)} height="16" />
          <b>{data.title}</b>
        </div>
        <a href={data.host} target="_blank">
          {data.host}
        </a>
      </li>
    </Dropdown>
  );
});

export default function ({ dispatch, curWebsiteId, websiteList }) {
  const { message } = App.useApp();
  const [newModal, setNewModal] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [removeCss, setRemoveCss] = useState();
  const [form] = Form.useForm(); // 新增网站表单
  const inputRef = useRef(null);

  const items = (websiteList || []).map((item, index) => (
    <WebsiteItem
      key={index}
      data={item}
      dispatch={dispatch}
      curWebsiteId={curWebsiteId}
      onEdit={() => {
        setNewModal({ type: "edit", id: item.id });
        form.setFieldsValue({
          title: item.title,
          host: item.host,
        });
      }}
    />
  ));

  // 导出数据
  const exportData = async () => {
    const data = await API.getData();
    bw.downloads.download({
      url: "data:application/json," + JSON.stringify(data),
      filename: "export.json",
    });
  };
  // 导入数据
  const onImport = () => {
    dispatch();
  };

  return (
    <div className="website-list">
      <h3 className="flex flex-middle">
        <span className="margin-right-auto">网站列表</span>
        <InputModule ref={inputRef} onImport={onImport} />
        <Tooltip title="新增网站">
          <NewSvg height="16" onClick={() => setNewModal({ type: "new" })} />
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
                label: <span className="mjdzt">导入数据</span>,
                icon: <ImportSvg height="20" width="20" />,
                onClick: () => {
                  inputRef.current.click();
                },
              },
              {
                key: 2,
                label: <span className="mjdzt">导出数据</span>,
                icon: <ExportSvg />,
                onClick: exportData,
              },
              {
                key: 3,
                label: <span className="mjdzt">与云端同步</span>,
                icon: <SyncSvg />,
              },
            ],
          }}>
          <MoreSvg height="16" />
        </Dropdown>
      </h3>
      <ul>{items}</ul>

      <Modal
        title={<span className="mjdzt">{newModal.type === "new" ? "新增网站" : "编辑网站"}</span>}
        open={newModal}
        onOk={() =>
          dispatch(
            newModal.type === "new"
              ? { type: "newWebsite", data: form.getFieldsValue() }
              : { type: "updateWebsite", data: form.getFieldsValue(), id: newModal.id }
          ).then(() => {
            setNewModal(false);
            message.success("新增成功");
          })
        }
        okText="确定"
        onCancel={() => {
          setNewModal(false);
          form.resetFields();
        }}
        cancelText="取消"
        okButtonProps={{ ghost: true }}
        cancelButtonProps={{ ghost: true }}
        closable={false}>
        <Form layout="vertical" form={form} autoComplete="off">
          <Form.Item label="标题" name="title" required tooltip="标题会在访问网站后被刷新" initialValue="">
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="网站地址" name="host" required initialValue="">
            <Input style={{ width: "100%" }} placeholder="请输入网站地址" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<span className="mjdzt">设置</span>}
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

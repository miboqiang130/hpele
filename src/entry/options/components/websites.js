import { memo, useRef, useState } from "react";
import { Tooltip, Dropdown, Modal, Input, Form, App, Button, Empty, Switch } from "antd";
import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import API from "@/script/api";
import bw from "@/script/browser";
import InputModule from "./InputModule";
import MoreSvg from "@/assets/svg/more.svg";
import NewSvg from "@/assets/svg/new.svg";
import ImportSvg from "@/assets/svg/import.svg";
import ExportSvg from "@/assets/svg/export.svg";
import SyncSvg from "@/assets/svg/sync.svg";
import DeleteSvg from "@/assets/svg/delete.svg";
import SettingSvg from "@/assets/svg/setting.svg";
import UrlSvg from "@/assets/svg/url.svg?url";
import EmptySvg from "@/assets/svg/empty.svg?url";

const WebsiteItem = memo(function ({ data, curWebsiteId, dispatch, onEdit }) {
  const { message, modal } = App.useApp();
  return (
    <li className={data.id === curWebsiteId ? "active" : ""} onClick={() => dispatch({ type: "select", id: data.id })}>
      <div className="website-title" title={data.title}>
        <img src={data.icon} alt="icon" onError={e => (e.target.src = UrlSvg)} height="16" />
        <b>{data.title}</b>
      </div>
      <div className="website-reg">
        <b>{data.host}</b>
      </div>
      {data.desc && <div className="website-desc margin-top-8">{data.desc}</div>}
      <div className="opt-bar margin-top-8">
        <Tooltip title="是否启用">
          <Switch
            size="small"
            checked={data.isEnable}
            defaultChecked
            className="margin-right-auto"
            onClick={(check, e) => {
              e.stopPropagation();
              API.toggleEnable(data.id);
            }}
          />
        </Tooltip>
        <Tooltip title="编辑">
          <EditOutlined className="margin-right-8" onClick={onEdit} />
        </Tooltip>
        <Tooltip title="删除">
          <DeleteSvg
            className="delete-btn"
            height="16"
            onClick={e => {
              e.stopPropagation();
              modal.confirm({
                icon: <ExclamationCircleOutlined />,
                content: <span>确定要删除吗?</span>,
                okButtonProps: { ghost: true },
                cancelButtonProps: { ghost: true },
                onOk() {
                  dispatch({ type: "deleteWebsite", id: data.id }).then(() => {
                    message.success("删除成功");
                  });
                },
              });
            }}
          />
        </Tooltip>
      </div>
    </li>
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
      onEdit={e => {
        e.stopPropagation();
        setNewModal({ type: "edit", id: item.id });
        form.setFieldsValue(item);
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
              // {
              //   key: 3,
              //   label: <span className="mjdzt">与云端同步</span>,
              //   icon: <SyncSvg />,
              // },
            ],
          }}>
          <MoreSvg height="16" />
        </Dropdown>
      </h3>
      {websiteList.length > 0 ? (
        <ul>{items}</ul>
      ) : (
        <Empty className="no-website column-middle" image={EmptySvg} imageStyle={{ height: 100 }} description={<span>你还没有创建网站</span>}>
          <Button type="primary" onClick={() => setNewModal({ type: "new" })}>
            新增
          </Button>
        </Empty>
      )}

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
            form.setFieldsValue({ title: "", desc: "", host: "" });
            message.success("操作成功");
          })
        }
        okText="确定"
        onCancel={() => {
          setNewModal(false);
          form.setFieldsValue({ title: "", desc: "", host: "" });
        }}
        cancelText="取消"
        okButtonProps={{ ghost: true }}
        cancelButtonProps={{ ghost: true }}
        closable={false}>
        <Form layout="vertical" form={form} autoComplete="off">
          <Form.Item label="标题" name="title" required tooltip="标题会在访问网站后被刷新" initialValue="">
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="网站域名" name="host" required tooltip="请输入网站域名" initialValue="">
            <Input style={{ width: "100%" }} placeholder="请输入网站域名，例如：https://website.com" />
          </Form.Item>
          <Form.Item label="网站备注" name="desc" initialValue="">
            <Input.TextArea style={{ width: "100%" }} placeholder="请输入备注" rows={4} />
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

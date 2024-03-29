import { memo, useRef } from "react";
import { Tooltip, Dropdown } from "antd";
import API from "@/script/api";
import InputModule from "./InputModule";
import MoreSvg from "@/assets/svg/more.svg";
import NewSvg from "@/assets/svg/new.svg";
import ImportSvg from "@/assets/svg/import.svg";
import ExportSvg from "@/assets/svg/export.svg";
import SyncSvg from "@/assets/svg/sync.svg";

const WebsiteItem = memo(function ({ data }) {
  return <li>{data.title}</li>;
});

export default function ({ data }) {
  const items = data.map(i => <WebsiteItem data={i} />);
  const inputRef = useRef(null);

  // 导出数据
  const exportData = async () => {
    const data = await API.getData();
    bw.downloads.download({
      url: "data:application/json," + JSON.stringify(data),
      filename: "export.json",
    });
  };

  return (
    <div className="website-list">
      <h3 className="flex flex-middle">
        <span className="margin-right-auto">网站列表</span>
        <InputModule ref={inputRef} />
        <Tooltip title="新增网站">
          <NewSvg height="16" />
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
    </div>
  );
}

import { forwardRef, memo } from "react";
import { App } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import API from "@/script/api";

function InputModule(props, ref) {
  // 确认弹窗
  const { message, modal } = App.useApp();
  // 读取文件内容方法
  const reader = new FileReader();
  reader.onload = async function (event) {
    const importData = async () => {
      const data = JSON.parse(event.target.result); // 这里是文件的内容
      await API.importData(data);
      message.success("导入成功");
      props.onImport();
    };
    const oldData = await API.getData();
    if (oldData.websiteList?.length > 0) {
      modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: <span>已存在数据，继续导入会覆盖，是否继续?</span>,
        okButtonProps: { ghost: true },
        cancelButtonProps: { ghost: true },
        onOk() {
          importData();
        },
      });
    } else importData();
    ref.current.value = null;
  };

  const onFileInput = () => {
    if (!ref.current.value) return;
    try {
      reader.readAsText(ref.current.files[0]);
    } catch {
      message.error("Error!");
    }
  };

  return <input type="file" className="hide" ref={ref} onChange={onFileInput} accept=".json" />;
}

export default memo(forwardRef(InputModule));

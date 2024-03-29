import { forwardRef, memo, useRef } from "react";
import { message } from "antd";
import API from "@/script/api";

function InputModule(props, ref) {
  // 读取文件内容方法
  const reader = new FileReader();
  reader.onload = async function (event) {
    console.log(event.target.result);
    return;
    const importData = async () => {
      const data = JSON.parse(event.target.result); // 这里是文件的内容
      await API.setData(data);
      messageApi.open({
        type: "success",
        content: "导入成功",
      });
    };
    const oldData = await API.getData();
    let flag = false;
    setIsOpen(false);
    if (oldData.models?.length > 0) {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: <p>已存在数据，继续导入会覆盖，是否继续?</p>,
        onOk() {
          API.clearData();
          importData();
        },
      });
    } else importData();
  };

  const onFileInput = () => {
    try {
      reader.readAsText(ref.current.files[0]);
    } catch {
      message.error("Error!");
    }
  };

  return (
    <input
      type="file"
      className="hide"
      ref={ref}
      onChange={onFileInput}
      accept=".json"
    />
  );
}

export default memo(forwardRef(InputModule));

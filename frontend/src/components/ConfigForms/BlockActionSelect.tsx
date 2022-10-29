import React, { useContext, useState } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Menu, MenuProps, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";

import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Row, Col } from "antd";

const BlockInput: React.FC = () => {
  const { selectedNode: node } = useContext(BuilderContext) as any;

  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();
  const [selectedValue, setSelectedValue] = useState("timestamp");
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    save({ label: selectedValue, command: "", state: "", ret: "" });
  };
  const onClick: MenuProps["onClick"] = (data) => {
    setSelectedValue(data.key);
    save?.({ label: data.key, command: "", state: "", ret: "" }); //TODO:
  };

  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          key: "timestamp",
          label: "Timestamp",
        },
        {
          key: "coinbase",
          label: "Coinbase",
        },
        {
          key: "baseFee",
          label: "Base Fee",
        },
        {
          key: "gasLimit",
          label: "Gas Limit",
        },
        {
          key: "number",
          label: "Number",
        },
      ]}
    />
  );

  return (
    <div>
      <Dropdown overlay={menu}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {selectedValue}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <Divider />
      <div>
        <Button onClick={cancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default BlockInput;

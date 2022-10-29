import React, { useContext, useState } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Menu, MenuProps, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";

import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Row, Col } from "antd";

const items = [
  {
    key: "lt",
    label: "Less then",
  },
  {
    key: "lte",
    label: "Less then equal",
  },
  {
    key: "gt",
    label: "Greater then",
  },
  {
    key: "gte",
    label: "Greater then equal",
  },
  {
    key: "eq",
    label: "Equal",
  },
  {
    key: "eq",
    label: "Not equal",
  },
];

const MathCompareInput: React.FC = () => {
  const { selectedNode: node } = useContext(BuilderContext) as any;
  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();
  const [selectedValue, setSelectedValue] = useState(node?.data?.label) as any;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    save({ label: selectedValue, command: "", state: values, ret: "" });
  };
  const onClick: MenuProps["onClick"] = (data) => {
    const item = items.find((i) => i.key == data.key);
    setSelectedValue(item?.label);

    // save({ label: item?.label, command: "", state: "", ret: "" });
  };

  const menu = <Menu onClick={onClick} items={items} />;

  return (
    <div>
      <Form
        style={{ gap: "10px", display: "flex", alignItems: "center" }}
        form={form}
        initialValues={node.data || { name: node.name }}
      >
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {selectedValue || "Select Value"}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Form.Item
          style={{ marginBottom: "0px" }}
          name="number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
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

export default MathCompareInput;

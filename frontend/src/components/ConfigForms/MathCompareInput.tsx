import React, { useContext, useState } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Menu, MenuProps, Divider } from "antd";
import { Contract as WeirollContract } from "@weiroll/weiroll.js";
import { abi as MathAbi } from "../../artifacts/contracts/Libraries/MathCompare.sol/MathCompare.json";

import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { Contract } from "ethers";
import { LIBRARIES_ADDRESS } from "../../constants";
import { useWeirollPlanner } from "../../context/Weiroll.provider";
import { Planner } from "@weiroll/weiroll.js";

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
    key: "neq",
    label: "Not equal",
  },
];

const MathCompareInput: React.FC = () => {
  const { selectedNode: node, nodes } = useContext(BuilderContext) as any;

  console.log("node", node);
  console.log("all nodes", nodes);
  //find index of current node in nodes
  const index = nodes.findIndex((n: any) => n.id == node.id);
  const previousNode = nodes?.[index - 1];

  console.log("previousNode", previousNode);
  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();
  const [selectedValue, setSelectedValue] = useState(node?.data?.key) as any;
  const [form] = Form.useForm();
  const item = items.find((i) => i.key == selectedValue);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const MathLibrary = new Contract(LIBRARIES_ADDRESS, MathAbi);
    const createLibrary = WeirollContract.createLibrary(MathLibrary);
    const libCall = createLibrary[selectedValue];
    console.log("previousNode.data");
    if (previousNode?.data?.call && libCall) {
      save({
        call: (prevValue: any) => libCall(prevValue, values.number),
        dependsOnPrev: true,
        values: values,
        label: item?.label,
      });
    } else {
      console.error("No previous node");
    }
  };

  const onClick: MenuProps["onClick"] = (data) => {
    setSelectedValue(data.key);
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
              {item?.label || "Select Value"}
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

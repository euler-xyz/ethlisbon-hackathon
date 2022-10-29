import React, { useContext, useEffect, useState } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Menu, MenuProps, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { abi as BlockABI } from "../../artifacts/contracts/Libraries/Block.sol/Block.json";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Row, Col } from "antd";
import { useWeirollPlanner } from "../../context/Weiroll.provider";
import { Contract } from "ethers";
import { LIBRARIES_ADDRESS } from "../../constants";
import { useProvider } from "wagmi";
const items = [
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
];
const BlockInput: React.FC = () => {
  const planner = useWeirollPlanner();
  const provder = useProvider();
  const { selectedNode: node } = useContext(BuilderContext) as any;
  console.log("node", node);
  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();
  const [selectedValue, setSelectedValue] = useState(node?.data?.label) as any;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const BlockLibrary = new Contract(LIBRARIES_ADDRESS, BlockABI, provder);

    planner.add(BlockLibrary[selectedValue]?.());

    save({ label: selectedValue, command: "", state: values, ret: "" });
  };

  const onClick: MenuProps["onClick"] = (data) => {
    console.log(data);
    const item = items.find((i) => i.key == data.key);
    setSelectedValue(item?.label);
    console.log(item);
    // save({ label: item?.label, command: "", state: "", ret: "" });
  };

  const menu = <Menu onClick={onClick} items={items} />;

  return (
    <div>
      <Dropdown overlay={menu}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {selectedValue || "Select Value"}
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

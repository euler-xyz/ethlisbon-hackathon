import React, { useContext, useState } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Menu, MenuProps, Divider } from "antd";
import { abi as BlockABI } from "../../artifacts/contracts/Libraries/Block.sol/Block.json";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useWeirollPlanner } from "../../context/Weiroll.provider";
import { Contract } from "ethers";
import { LIBRARIES_ADDRESS } from "../../constants";
import { Contract as WeirollContract } from "@weiroll/weiroll.js";

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
  const { selectedNode: node } = useContext(BuilderContext) as any;
  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();
  const [selectedValue, setSelectedValue] = useState(node?.data?.key) as any;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const BlockLibrary = new Contract(LIBRARIES_ADDRESS, BlockABI);
    const createLibrary = WeirollContract.createLibrary(BlockLibrary);
    const call = createLibrary[selectedValue];

    if (call) {
      const ret = planner.add(call());
      const { commands, state } = planner.plan();

      save({
        label: selectedValue,
        command: commands,
        state: state,
        values,
        ret: ret,
      });
    }
  };

  const onClick: MenuProps["onClick"] = (data) => {
    setSelectedValue(data?.key);
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

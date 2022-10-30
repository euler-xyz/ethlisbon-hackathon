import React, { useContext, useState } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Menu, MenuProps, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";

import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Row, Col } from "antd";
import { Contract } from "ethers";
import { Contract as WeirollContract } from "@weiroll/weiroll.js";
import { LIBRARIES_ADDRESS } from "../../constants";
import { abi as PriceAbi } from "../../artifacts/contracts/Libraries/Prices.sol/Prices.json";
import { useWeirollPlanner } from "../../context/Weiroll.provider";
import { Planner } from "@weiroll/weiroll.js";

const items = [
  {
    key: "getPrice",
    label: "Get ETH Price",
  },
];

const Prices: React.FC = () => {
  const planner = useWeirollPlanner();
  const { selectedNode: node } = useContext(BuilderContext) as any;
  console.log("node", node);
  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();
  const [selectedValue, setSelectedValue] = useState(
    node?.data?.key || "getPrice"
  ) as any;
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const PricesLibrary = new Contract(LIBRARIES_ADDRESS, PriceAbi);
    const createLibrary = WeirollContract.createLibrary(PricesLibrary);

    const call = createLibrary[selectedValue];
    if (call) {
      save({
        call: (prevValue: any) =>
          call("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
        dependsOnPrev: false,
        values,
      });
    }
  };
  const onClick: MenuProps["onClick"] = (data) => {
    setSelectedValue(data.key);
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

export default Prices;

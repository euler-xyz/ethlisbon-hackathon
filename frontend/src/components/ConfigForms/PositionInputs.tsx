import React, { useContext } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Divider } from "antd";
import { Contract } from "ethers";
import { Contract as WeirollContract } from "@weiroll/weiroll.js";
import { LIBRARIES_ADDRESS } from "../../constants";
import { useWeirollPlanner } from "../../context/Weiroll.provider";
import { abi as PositionAbi } from "../../artifacts/contracts/Libraries/Positions.sol/Positions.json";
import { Planner } from "@weiroll/weiroll.js";

const addressPattern = /^0x[a-fA-F0-9]{40}$/;

const PositionInputs: React.FC = () => {
  const { selectedNode: node } = useContext(BuilderContext) as any;
  const planner = useWeirollPlanner();
  console.log("planner", planner.state);
  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const PricesLibrary = new Contract(LIBRARIES_ADDRESS, PositionAbi);
      const createLibrary = WeirollContract.createLibrary(PricesLibrary);

      save({
        call: (prevValue: any) =>
          createLibrary.closePosition(
            values.underlying,
            values.collateral,
            values.fee
          ),
        dependsOnPrev: false,
        values,
      });
    } catch (error) {
      console.log(error);
      const values = form.getFieldsValue();
      save?.(values, !!error);
    }
  };
  // get ethereum address regex pattern

  return (
    <div>
      <Form form={form} initialValues={node.data || { name: node.name }}>
        <Form.Item
          name="underlying"
          label="Underlying"
          rules={[{ required: true, pattern: addressPattern }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="collateral"
          label="Collateral"
          rules={[{ required: true, pattern: addressPattern }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="fee" label="V3 Pool Fee" rules={[{ required: true }]}>
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

export default PositionInputs;

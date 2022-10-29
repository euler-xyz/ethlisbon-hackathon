import React, { useContext } from "react";
import { BuilderContext, useDrawer } from "react-flow-builder";
import { Form, Button, Input, Divider } from "antd";

const PositionInputs: React.FC = () => {
  const { selectedNode: node } = useContext(BuilderContext) as any;

  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      save?.(values);
    } catch (error) {
      const values = form.getFieldsValue();
      save?.(values, !!error);
    }
  };

  return (
    <div>
      <Form form={form} initialValues={node.data || { name: node.name }}>
        <Form.Item
          name="underlying"
          label="Underlying"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="collateral"
          label="Collateral"
          rules={[{ required: true }]}
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

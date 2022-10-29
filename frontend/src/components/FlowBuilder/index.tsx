// index.tsx
import React, { useState, useContext } from "react";
import FlowBuilder, {
  NodeContext,
  INode,
  IRegisterNode,
  IConfigComponent,
  useDrawer,
} from "react-flow-builder";
import ConfigForm from "../ConfigForms";
import BlockInput from "../ConfigForms/BlockActionSelect";
import SimpleInput from "../ConfigForms/BlockActionSelect";

import "./index.css";

const StartNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="start-node">{node.name}</div>;
};

const EndNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="end-node">{node.name}</div>;
};

const ConfigComponent: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="config-node">{node.name}</div>;
};

const OtherNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="other-node">{node.name}</div>;
};

const ConditionNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  console.log("node state", node);
  return <div className="condition-node">{`${node.name} → ${node?.data?.label}`}</div>;
};

const registerNodes: IRegisterNode[] = [
  {
    type: "start",
    name: "start",
    displayComponent: StartNodeDisplay,
    isStart: true,
  },
  {
    type: "block",
    name: "Block",
    displayComponent: ConditionNodeDisplay,
    configComponent: BlockInput,
  },
  {
    type: "MathCompare",
    name: "Math Compare",
    displayComponent: ConditionNodeDisplay,
    configComponent: ConfigForm,
  },
  {
    type: "Position",
    name: "Position",
    displayComponent: OtherNodeDisplay,
    configComponent: ConfigForm,
  },
  {
    type: "Revert",
    name: "Revert",
    displayComponent: OtherNodeDisplay,
    configComponent: ConfigForm,
  },
  {
    type: "Tx",
    name: "Tx",
    displayComponent: OtherNodeDisplay,
    configComponent: ConfigForm,
  },
  {
    type: "end",
    name: "execute",
    displayComponent: EndNodeDisplay,
    isEnd: true,
  },
];

const Demo = () => {
  const [nodes, setNodes] = useState<INode[]>([]);

  const handleChange = (nodes: INode[]) => {
    console.log("nodes change", nodes);
    setNodes(nodes);
  };

  return (
    <FlowBuilder
      nodes={nodes}
      onChange={handleChange}
      registerNodes={registerNodes}
      drawerVisibleWhenAddNode={true}
    />
  );
};

export default Demo;

// index.tsx
import React, { useState, useContext } from "react";
import FlowBuilder, {
  NodeContext,
  INode,
  IRegisterNode,
  IConfigComponent,
  useDrawer,
} from "react-flow-builder";
import { WeirollProvider } from "../../context/Weiroll.provider";
import ConfigForm from "../ConfigForms";
import BlockInput from "../ConfigForms/BlockActionSelect";
import SimpleInput from "../ConfigForms/BlockActionSelect";
import MathCompareInput from "../ConfigForms/MathCompareInput";
import PositionInputs from "../ConfigForms/PositionInputs";
import Prices from "../ConfigForms/Prices";

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

// function that truncates the etherum address
const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const OtherNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return (
    <div>
      <div className="other-node">
        <div>{node.name}</div>
        <div>
          Underlying: {truncateAddress(node.data?.values?.underlying || "")}
        </div>
        <div>
          Collateral: {truncateAddress(node.data?.values?.collateral || "")}
        </div>
        <div>Fee: {node.data?.values?.fee}</div>
      </div>
    </div>
  );
};

const BlockNodeMath: React.FC = () => {
  const node = useContext(NodeContext);
  console.log("node state", node);
  return (
    <div className="condition-node">{`${node.name} → ${
      node?.data?.label || "?"
    }`}</div>
  );
};

const MathNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return (
    <div className="condition-node">{`${node.name} → ${
      node?.data?.label || "?"
    } ${node?.data?.state?.number || ""}`}</div>
  );
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
    displayComponent: BlockNodeMath,
    configComponent: BlockInput,
  },
  {
    type: "MathCompare",
    name: "Math",
    displayComponent: MathNodeDisplay,
    configComponent: MathCompareInput,
  },
  {
    type: "Position Close",
    name: "Position",
    displayComponent: OtherNodeDisplay,
    configComponent: PositionInputs,
  },
  {
    type: "getPrice",
    name: "Get Price",
    displayComponent: MathNodeDisplay,
    configComponent: Prices,
  },
  // {
  //   type: "Revert",
  //   name: "Revert",
  //   displayComponent: OtherNodeDisplay,
  //   configComponent: ConfigForm,
  // },
  // {
  //   type: "Tx",
  //   name: "Tx",
  //   displayComponent: OtherNodeDisplay,
  //   configComponent: ConfigForm,
  // },
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
    <WeirollProvider>
      <FlowBuilder
        nodes={nodes}
        onChange={handleChange}
        registerNodes={registerNodes}
        drawerVisibleWhenAddNode={true}
      />
    </WeirollProvider>
  );
};

export default Demo;
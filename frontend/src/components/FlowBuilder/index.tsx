// index.tsx
import { Button } from "antd";
import React, { useState, useContext } from "react";
import FlowBuilder, {
  NodeContext,
  INode,
  IRegisterNode,
  IConfigComponent,
  useDrawer,
  BuilderContext,
} from "react-flow-builder";
import { WeirollProvider } from "../../context/Weiroll.provider";
import ConfigForm from "../ConfigForms";
import BlockInput from "../ConfigForms/BlockActionSelect";
import SimpleInput from "../ConfigForms/BlockActionSelect";
import MathCompareInput from "../ConfigForms/MathCompareInput";
import PositionInputs from "../ConfigForms/PositionInputs";
import Prices from "../ConfigForms/Prices";
import { Planner } from "@weiroll/weiroll.js";
import { abi } from "../../artifacts/contracts/WeirollModule.sol/WeirollModule.json";
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import "./index.css";
import { ethers } from "ethers";
import { SAFE_ADDRESS, WEIROLL_ADDRESS } from "../../constants";
import { etherscanBlockExplorers, useProvider, useSigner } from "wagmi";

const StartNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="start-node">{node.name}</div>;
};

const handleExecute = async (nodes: any) => {
  // const signer = useSigner();
  const signer = useSigner() as any;
  // const ethProvider = new ethers.providers.Web3Provider(provider as any);
  // create a plan
  const planner = new Planner();
  let lastReturn: any;
  // remove first and last element of nodes
  nodes.slice(1, -1).forEach((node: any) => {
    console.log(node);
    const { data } = node;
    if (data?.value || data?.values) {
      console.log(lastReturn);
      if (node?.data?.dependsOnPrev) {
        lastReturn = planner.add(node.data.call?.(lastReturn));
      } else {
        lastReturn = planner.add(node.data.call?.());
      }
    }
  });
  const { commands, state } = planner.plan();

  const reward = ethers.utils.parseEther("0.001");
  const weirollModule = new ethers.Contract(WEIROLL_ADDRESS, abi);

  const safeTransactionData = {
    to: WEIROLL_ADDRESS,
    value: "0",
    data: (
      await weirollModule.populateTransaction.addAllowedScript(
        reward,
        commands,
        state
      )
    ).data as string,
  };

  const ethAdapter = new EthersAdapter({
    ethers,
    signer: signer,
  });
  const safeSdk: Safe = await Safe.create({
    ethAdapter,
    safeAddress: SAFE_ADDRESS,
  });
  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData,
  });
  const txHash = await safeSdk.getTransactionHash(safeTransaction);
  console.log("Script added, tx hash: ", txHash);

  const approveTxResponse = await safeSdk.approveTransactionHash(txHash);
  await approveTxResponse.transactionResponse?.wait();
  console.log("Approved, tx hash: ", approveTxResponse.hash);

  const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
  await executeTxResponse.transactionResponse?.wait();
  console.log("Executed, tx hash: ", executeTxResponse.hash);

  console.log(planner);
};

const EndNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  const { nodes } = useContext(BuilderContext) as any;

  return <Button onClick={(val) => handleExecute(nodes)}>{node.name}</Button>;
};

const ConfigComponent: React.FC = () => {
  const node = useContext(NodeContext);
  return <Button>{node.name}</Button>;
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
    } ${node?.data?.values?.number || ""}`}</div>
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

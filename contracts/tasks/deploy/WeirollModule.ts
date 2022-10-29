import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Weiroll } from "../../types/contracts/WeirollModule.sol/WeirollModule";
import type { Weiroll__factory } from "../../types/factories/contracts/WeirollModule.sol/WeirollModule__factory";
import Addresses from "@eulerxyz/euler-interfaces/addresses/addresses-goerli.json"

task("deploy:Weiroll")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const weirollFactory: Weiroll__factory = <Weiroll__factory>await ethers.getContractFactory("WeirollModule");
    const weiroll: Weiroll = <Weiroll>await weirollFactory.connect(signers[0]).deploy(Addresses.euler, Addresses.exec);
    await weiroll.deployed();
    console.log("Weiroll Module deployed to: ", weiroll.address);
  });

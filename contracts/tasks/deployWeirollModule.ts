import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import Addresses from "@eulerxyz/euler-interfaces/addresses/addresses-mainnet.json"

task("deploy:Weiroll")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const weirollFactory = await ethers.getContractFactory("WeirollModule");
    const weiroll = await weirollFactory.connect(signers[0]).deploy(Addresses.euler);
    await weiroll.deployed();
    console.log("Weiroll Module deployed to: ", weiroll.address);
  });

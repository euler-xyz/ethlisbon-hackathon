import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

// import type { Weiroll } from "../../types/contracts/WeirollModule.sol/WeirollModule";
import Addresses from "@eulerxyz/euler-interfaces/addresses/addresses-goerli.json"

task("deploy:Weiroll")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    const weirollFactory = await ethers.getContractFactory("WeirollModule");
    const weiroll = await weirollFactory.connect(signers[0]).deploy(Addresses.euler, Addresses.exec);
    await weiroll.deployed();
    console.log("Weiroll Module deployed to: ", weiroll.address);
  });

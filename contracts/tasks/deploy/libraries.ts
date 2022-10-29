import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("deploy:libraries")
    .setAction(async function (taskArguments: TaskArguments, { ethers }) {
        const signers: SignerWithAddress[] = await ethers.getSigners();
        const all = await (await ethers.getContractFactory("All", signers[0])).deploy();
        console.log("libraries deployed to: ", all.address);
  });
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import { Euler } from "@eulerxyz/euler-sdk"

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

task("prepareSafe")
  .addPositionalParam("owners")
  .addPositionalParam("threshold")
  .addPositionalParam("weirollModuleAddress")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const params = [
      [signers[7].address],
      ethers.utils.hexValue(100)
    ]
    await ethers.provider.send('tenderly_addBalance', params)

    const sdk = new Euler(ethers.provider)
    const ethAdapter = new EthersAdapter({ethers, signer: signers[7]})
    const safeFactory = await SafeFactory.create({ ethAdapter })
    const owners = taskArguments.owners.split(',')
    const threshold = taskArguments.threshold
    const safeAccountConfig: SafeAccountConfig = { owners, threshold }
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })
    console.log("Safe deployed to: ", safeSdk.getAddress())

    await signers[7].sendTransaction({
      to: safeSdk.getAddress(),
      value: ethers.utils.parseEther("0.01")
    })
    const WETH = sdk.erc20(WETH_ADDRESS).connect(signers[7])
    await WETH.transfer(safeSdk.getAddress(), ethers.utils.parseEther("0.01"))

    //const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: "0xdeF003E373ceef420677FB0d64e8781557cd4F74" })
    const safeTransaction = await safeSdk.createEnableModuleTx(taskArguments.weirollModuleAddress)
    const txHash = await safeSdk.getTransactionHash(safeTransaction)
    console.log("Module enabled, tx hash: ", txHash)

    const approveTxResponse = await safeSdk.approveTransactionHash(txHash)
    await approveTxResponse.transactionResponse?.wait()
    console.log("Approved, tx hash: ", approveTxResponse.hash)

    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    await executeTxResponse.transactionResponse?.wait()
    console.log("Executed, tx hash: ", executeTxResponse.hash)
  });

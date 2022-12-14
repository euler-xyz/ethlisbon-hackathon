import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { Contract, Planner } from "@weiroll/weiroll.js"

import { abi } from "../artifacts/contracts/WeirollModule.sol/WeirollModule.json";
import { Euler } from "@eulerxyz/euler-sdk"
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import Safe from '@gnosis.pm/safe-core-sdk'

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"

task("addDummyScript")
  .addPositionalParam("safeAddress")
  .addPositionalParam("weirollModuleAddress")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const sdk = new Euler(ethers.provider);
    const signers = await ethers.getSigners()
    
    const WETH = sdk.erc20(WETH_ADDRESS)
    const eWETH = sdk.eToken(await sdk.contracts.markets.underlyingToEToken(WETH_ADDRESS))
    const dDAI = sdk.dToken(await sdk.contracts.markets.underlyingToDToken(DAI_ADDRESS))
    const weirollWETH = Contract.createContract(WETH)
    const weirollEWETH = Contract.createContract(eWETH)
    const weirollDDAI = Contract.createContract(dDAI)
    const weirollMarkets = Contract.createContract(sdk.contracts.markets)

    const planner = new Planner()
    planner.add(weirollWETH.approve(sdk.addresses.euler, 100))
    planner.add(weirollEWETH.deposit(0, 100))
    planner.add(weirollMarkets.enterMarket(0, WETH_ADDRESS))
    planner.add(weirollMarkets.enterMarket(0, DAI_ADDRESS))
    planner.add(weirollDDAI.borrow(0, 10))
    const { commands, state } = planner.plan()

    const reward = ethers.utils.parseEther("0.001")
    const weirollModule = new ethers.Contract(taskArguments.weirollModuleAddress, abi)
    
    const safeTransactionData = {
      to: taskArguments.weirollModuleAddress,
      value: "0",
      data: (await weirollModule.populateTransaction.addAllowedScript(reward, commands, state)).data as string
    }

    const ethAdapter = new EthersAdapter({ethers, signer: signers[0]})
    const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: taskArguments.safeAddress })
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
    const txHash = await safeSdk.getTransactionHash(safeTransaction)
    console.log("Script added, tx hash: ", txHash)

    const approveTxResponse = await safeSdk.approveTransactionHash(txHash)
    await approveTxResponse.transactionResponse?.wait()
    console.log("Approved, tx hash: ", approveTxResponse.hash)

    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    await executeTxResponse.transactionResponse?.wait()
    console.log("Executed, tx hash: ", executeTxResponse.hash)
});

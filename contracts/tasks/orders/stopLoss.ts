import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import weiroll, { CommandFlags, Planner, Contract } from "@weiroll/weiroll.js"
import { constants } from "ethers";

task("create-stop-loss")
    .addParam("collateral")
    // .addParam("collateralEToken")
    .addParam("underlying")
    // .addParam("underlyingDToken")
    .addParam("triggerPrice")
    .setAction(async(taskArgs, { ethers }) => {
        const [account] = await ethers.getSigners();

        const { getContractFactory } = ethers;

        const planner = new Planner();

        // deploy contracts
        // TODO: deploy these seperately
        const pricesLibEthers = await (await getContractFactory("Prices", account)).deploy();
        const pricesLib = Contract.createContract(pricesLibEthers, CommandFlags.STATICCALL);

        const mathCompareLibEthers = await (await getContractFactory("MathCompare", account)).deploy();
        const mathCompareLib = Contract.createContract(mathCompareLibEthers, CommandFlags.STATICCALL);

        const reverLibEthers = await (await getContractFactory("Revert", account)).deploy();
        const revertLib = Contract.createContract(reverLibEthers, CommandFlags.STATICCALL);

        // const collateralETokenEthers = await (await getContractFactory("IEulerEToken", account)).attach(taskArgs.collateralEToken);
        // const collateralEToken = Contract.createContract(collateralETokenEthers, CommandFlags.CALL);

        // const underlyingDTokenEthers = await (await getContractFactory("IEulerDToken", account)).attach(taskArgs.underlyingDToken);
        // const underlyingDToken = Contract.createContract(underlyingDTokenEthers, CommandFlags.CALL);

        const positionsLibEthers = await (await getContractFactory("Positions", account)).deploy();
        const positionsLib = Contract.createContract(positionsLibEthers, CommandFlags.DELEGATECALL);

        const priceRet = planner.add(pricesLib.getPrice(taskArgs.underlying));

        // Check if price <= triggerPrice
        const ltePriceRet = planner.add(mathCompareLib.lte(priceRet, taskArgs.triggerPrice));
        planner.add(revertLib.revert(ltePriceRet));

        // Withdraw all collateral to repay debt
        // planner.add(collateralEToken.withdraw(0, constants.MaxUint256));

        // Close position
        planner.add(positionsLib.closePosition(taskArgs.underlying, taskArgs.collateral, 3000));

        const { commands, state } = planner.plan();

        console.log(commands);
        console.log(state);
});
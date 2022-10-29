import { task } from "hardhat/config";

task("freeTenderlyMoney")
    .addPositionalParam("addr")
    .setAction(async (args) => {

    console.log("BEFORE: ", await ethers.provider.getBalance(args.addr));

    const params = [
        [args.addr],
        ethers.utils.hexValue(ethers.utils.parseEther('100'))
    ];

    await ethers.provider.send('tenderly_addBalance', params);

    console.log("AFTER: ", await ethers.provider.getBalance(args.addr));
});

import { task } from "hardhat/config";
import fetch from 'cross-fetch';


const fetchPeriod = 1000;
const weirollModuleAddr = '0x72A9A89Cc5e75444BD7D0c7EBfc2C9a5165EafB9';


task("keeper", "Runs keeper bot", async (args) => {
    const WeirollModule = require("../artifacts/contracts/WeirollModule.sol/WeirollModule.json");
    const iface = new ethers.utils.Interface(WeirollModule.abi);

    let currBlock = await ethers.provider.getBlockNumber();

    let orders = {};

    let logs = await fetchLogs(iface, "OrderCreated", currBlock - 1000, currBlock);

    for (let l of logs) {
        orders[l.args.scriptHash] = l.args;
    }


    let wModule = await ethers.getContractAt('WeirollModule', weirollModuleAddr);

    for (let scriptHash of Object.keys(orders)) {
        let o = orders[scriptHash];
        let res = await wModule.executeWeiroll(o.module, o.commands, o.state);
        console.log("GOT", res);
    }
});




async function fetchLogs(iface, topic, fromBlock, toBlock) {
    let params = [{
        fromBlock: '0x' + fromBlock.toString(16),
        toBlock: '0x' + toBlock.toString(16),

        address: [weirollModuleAddr],
        topics: [iface.getEventTopic('OrderCreated')],
    }];

    let query = {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getLogs",
        params,
    };

    let res = await fetch(hre.network.config.url, {
                        method: 'post',
                        body: JSON.stringify(query),
                        headers: { 'Content-Type': 'application/json' },
                    });

    let resJson = await res.json();

    return resJson.result.map(l => iface.parseLog(l));
}

import { task } from "hardhat/config";
import fetch from 'cross-fetch';


const fetchPeriod = 1000;
//const weirollModuleAddr = '0x72A9A89Cc5e75444BD7D0c7EBfc2C9a5165EafB9';
const weirollModuleAddr = '0x5056622fd5f310D30DFF940E937c144C4CC68E73';


task("keeper", "Runs keeper bot", async (args) => {
    const WeirollModule = require("../artifacts/contracts/WeirollModule.sol/WeirollModule.json");
    const iface = new ethers.utils.Interface(WeirollModule.abi);

    let currBlock = await ethers.provider.getBlockNumber();


    let orders = {};

    {
        let createdLogs = await fetchLogs(iface, 'OrderCreated', currBlock - fetchPeriod, currBlock);

        for (let l of createdLogs) {
            orders[l.args.scriptHash] = l.args;
        }
    }

    {
        let removedLogs = await fetchLogs(iface, 'OrderRemoved', currBlock - fetchPeriod, currBlock);

        for (let l of removedLogs) {
            delete orders[l.args.scriptHash];
        }
    }

    console.log(`Found ${Object.keys(orders).length} live orders.`);


    let wModule = await ethers.getContractAt('WeirollModule', weirollModuleAddr);

    for (let scriptHash of Object.keys(orders)) {
        //if (scriptHash !== '0x4be7629b1b1ba276a37b3b43ab3319af8bca8df3bae99419463c04487f35425e') continue;
        let o = orders[scriptHash];
        try {
            let res = await wModule.executeWeiroll(o.module, o.commands, o.state, { gasLimit: 5000000, });
            //let res = await wModule.executeWeiroll(o.module, o.commands, o.state);
            console.log(`${scriptHash} OK, waiting to mine:`);
            res = await res.wait();
            console.log(res);
        } catch(e) {
            console.log(`${scriptHash} FAIL ${e.reason}`);
            //console.log(e);
        }
    }
});




async function fetchLogs(iface, topic, fromBlock, toBlock) {
    let params = [{
        fromBlock: '0x' + fromBlock.toString(16),
        toBlock: '0x' + toBlock.toString(16),

        address: [weirollModuleAddr],
        topics: [iface.getEventTopic(topic)],
    }];

    let query = {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getLogs",
        params,
    };

    console.log("RPC URL", hre.network.config.url);
    let res = await fetch(hre.network.config.url, {
                        method: 'post',
                        body: JSON.stringify(query),
                        headers: { 'Content-Type': 'application/json' },
                    });

    let resJson = await res.json();

    return resJson.result.map(l => iface.parseLog(l));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

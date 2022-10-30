// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.4;

// Modified from: https://github.com/weiroll/safe-module/blob/main/contracts/WeirollModule.sol
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@weiroll/weiroll/contracts/VM.sol";
 
contract WeirollModule is VM {
     string public constant NAME = "Weiroll Module";
     string public constant VERSION = "0.1.0";

     address immutable public euler;

     // This mapping represents specific script than can be executed
     // Safe -> Script Hash -> Reward
     mapping(address => mapping(bytes32 => uint256)) allowedScript;

     address currentSafe;

     event OrderCreated(address indexed module, bytes32 indexed scriptHash, uint256 reward, bytes32[] commands, bytes[] state);
     event OrderRemoved(address indexed module, bytes32 indexed scriptHash);

    constructor(address _euler) {
       euler = _euler;
    }

    function addAllowedScript(uint256 reward, bytes32[] memory commands, bytes[] memory state) public {
        require(reward > 0, "reward must be greater than 0");
        bytes32 scriptHash = keccak256(abi.encode(commands, state));
        allowedScript[msg.sender][scriptHash] = reward;

        emit OrderCreated(msg.sender, scriptHash, reward, commands, state);
    }

     function removeAllowedScript(bytes32 scriptHash) public {
        require(allowedScript[msg.sender][scriptHash] > 0, "must be allowed first");
        allowedScript[msg.sender][scriptHash] = 0;

        emit OrderRemoved(msg.sender, scriptHash);
     }

    function execute(bytes32[] memory commands, bytes[] memory state) public payable {
        //require(msg.sender == currentSafe, "must be current safe");
        _execute(commands, state);
    }

    function executeWeiroll(
        address payable safe,
        bytes32[] memory commands,
        bytes[] memory state
    ) public {
        bytes32 scriptHash = keccak256(abi.encode(commands, state));
        uint256 reward = allowedScript[address(safe)][scriptHash];
        require(reward > 0, "not allowed to execute");
        require(currentSafe == address(0), "current safe must be zero");
        require(safe.balance >= reward, "safe balance must be gte reward");

        bytes memory data = abi.encodeWithSignature(
            "execute(bytes32[],bytes[])",
            commands,
            state
        );

        currentSafe = address(safe);

        require(
            GnosisSafe(safe).execTransactionFromModule(
                address(this),
                0,
                data,
                Enum.Operation.DelegateCall
            ),
            "could not execute script"
        );

        allowedScript[safe][scriptHash] = 0;
        emit OrderRemoved(currentSafe, scriptHash);

        // transfer the reward
        require(
            GnosisSafe(safe).execTransactionFromModule(
                msg.sender, 
                reward, 
                "", 
                Enum.Operation.Call
            ), 
            "could not execute reward transfer"
        );

        currentSafe = address(0);
    }
}

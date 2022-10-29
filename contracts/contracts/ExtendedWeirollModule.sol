// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.4;

// Modified from: https://github.com/weiroll/safe-module/blob/main/contracts/WeirollModule.sol
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@weiroll/weiroll/contracts/VM.sol";
 
contract WeirollModule is VM {
     string public constant NAME = "Weiroll Module";
     string public constant VERSION = "0.1.0";

     // This mapping represents specific script than can be executed
     // Safe -> Script Hash -> Allowed
     mapping(address => mapping(bytes32 => bool)) allowedScript;

     event OrderCreated(address indexed module, bytes32 indexed scriptHash, bytes32[] commands, bytes[] state);
     event OrderRemoved(address indexed module, bytes32 indexed scriptHash);

     constructor() {}

     function addAllowedScript(bytes32[] memory commands, bytes[] memory state) public {
        bytes32 scriptHash = keccak256(abi.encode(commands, state));
        allowedScript[msg.sender][scriptHash] = true;

        emit OrderCreated(msg.sender, scriptHash, commands, state);
     }

     function removeAllowedScript(bytes32 scriptHash) public {
        require(allowedScript[msg.sender][scriptHash], "must be allowed first");
        allowedScript[msg.sender][scriptHash] = false;

        emit OrderRemoved(msg.sender, scriptHash);
     }

     function execute(bytes32[] calldata commands, bytes[] memory state)
        public
        payable
        returns (bytes[] memory)
    {
        return _execute(commands, state);
    }

     function executeWeiroll(
         GnosisSafe safe,
         bytes32[] calldata commands,
         bytes[] memory state
     ) public {
        require(allowedScript[address(safe)][keccak256(abi.encode(commands, state))],
            "not allowed to execute"
        );

        bytes memory data = abi.encodeWithSignature(
            "execute(bytes32[],bytes[])",
            commands,
            state
        );

        require(
            safe.execTransactionFromModule(
                address(this),
                0,
                data,
                Enum.Operation.DelegateCall
            ),
            "could not execute script"
        );
     }
}
# Eth lisbon hackathon

## Architecture

Gnosis safe users can install a custom module that allows the safe owner installation custom scripts of arbitrary complexity. Keeper bots then monitor for these orders and when they detect any that can be executed succesfully, they will do so in exchange for a fee that is determined by the script.

When a script is installed, an event is emitted that contains the code for the script. The keepers must transmit this code when performing execution. This version will be hashed by the gnosis safe module to verify the scripts haven't been modified.

## Use-Cases

These scripts allow users to create conditional orders of many types:

* limit orders
* stop loss
* take profit
* trailing stop
* one-cancels-all
* if-touched orders
* good after/before time
* trigger on a *different* asset's price
* leverage management

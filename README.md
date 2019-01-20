[![CircleCI](https://circleci.com/gh/ConsenSys/truffle-analyze.svg?style=svg)](https://circleci.com/gh/ConsenSys/truffle-analyze)
[![Coverage Status](https://coveralls.io/repos/github/ConsenSys/truffle-analyze/badge.svg?branch=master)](https://coveralls.io/github/ConsenSys/truffle-analyze?branch=master)

# Introduction

A [truffle "run" plugin](https://truffleframework.com/docs/truffle/getting-started/writing-external-scripts) that runs [MythX](mythx.io) Smart Contract analyses on truffle projects.

_This is alpha code. You won't be able to use this without a MythX account,
and will be more generally distributed in the January-February time period._

Prelmiminary pre 5.0.0 versions were demo'd at
[trufflecon2018](https://truffleframework.com/trufflecon2018) and
[devcon4](https://devcon4.ethereum.org/).

# Installation

1. Install plugin:

```console
$ npm install truffle-analyze
```

2. Configure each truffle project to use plugin.

In your truffle project put in `truffle.js`:

```
module.exports = {
    plugins: [ "truffle-analyze" ]
};
```

For now `truffle.js` needs to be adjusted for each project. However, changes to truffle are planned
so that in the future you can specifiy this globally.

3. Set `MYTHX` environment variables.

Get an ETH address from [MetaMask](https://metamask.io). Set the following enviromment variables,
adjust for your ETH address and password:

```
export MYTHRIL_ETH_ADDRESS=0x1234567891235678900000000000000000000000
export MYTHRIL_PASSWORD='Put your password in here!'
```

# Usage

```console
$ truffle run analyze help

  Usage:        truffle run analyze [options] [*contract-name1* [contract-name2*] ...]
  Description:  Run MythX analyses on a contract
  Options:
    --debug     Provide additional debug output
    --mode { quick | full }
                Perform quick or or in-depth (full) analysis
    --style {stylish | unix | visualstudio | table | tap | ...}
                Output reort in the given es-lint style.
                See https://eslint.org/docs/user-guide/formatters/ for a full list.
    --timeout *seconds* ,
                Limit MythX analysis time to *s* seconds.
                The default is 120 seconds (two minutes).
    --version  Show package and MythX version information.
```

Runs MythX analyses on given Solidity contracts. If no contracts are
given, all are analyzed.

Options are deliberately sparse since we want simple interaction. Most
of the complexity is hidden behind the MythX.

If you leave off a _contract-name_, we'll find one inside the
project. If you have more than one contract in the project you should
specify which one you want to use. Instead of a contract name inside a
solidity file, you can also give either a relative or absolute path
the a JSON file the `build/contracts` directory. This is useful if
you are running inside a shell that contains command completion.

Here is an example:

```console
$ truffle run analyze SimpleSuicide
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/SimpleDAO.sol...
Compiling ./contracts/simple_suicide.sol...
Compiling ./contracts/suicide.sol...

/tmp/github/vulnerable-truffle-project/contracts/SimpleSuicide.sol
  4:4  error  The function '_function_0xa56a3b5a' executes the SUICIDE instruction                     mythril/SWC-106
  0:0  error  Functions that do not have a function visibility type specified are 'public' by default  maru/SWC-100

✖ 2 problems (2 errors, 0 warnings)

```

Note that in above that `analyze` may invoke `compile` when sources are not up to date.

The default report style is `stylish` however you may want to experiment with other styles.
Here is an example of using the  `table` format:


```
$ truffle+analyze analyze --style table

/src/external-vcs/github/vulnerable-truffle-project/contracts/SimpleDAO.sol

║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║
╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢
║ 12       │ 4        │ error    │ A possible integer overflow exists in the function     │ mythril/SWC-101      ║
║          │          │          │ '_function_0x00362a95'.                                │                      ║
║ 17       │ 14       │ error    │ This contract executes a message call to the           │ mythril/SWC-107      ║
║          │          │          │ address of the transaction sender.                     │                      ║
║ 0        │ 0        │ error    │ Contracts should be deployed with the same             │ maru/SWC-103         ║
║          │          │          │ compiler version and flags that they have been         │                      ║
║          │          │          │ tested with thoroughly.                                │                      ║

╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 3 Errors                                                                                                       ║
╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ 0 Warnings                                                                                                     ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

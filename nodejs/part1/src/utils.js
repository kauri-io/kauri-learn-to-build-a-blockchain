"use strict";

(async () => {

  const SHA256  = require("crypto-js/sha256");
  const UUIDV4    = require("uuid/v4");

  function getSHA256HexString(input) {
    return SHA256(input).toString();
  }

  function parseArgs() {
    return process.argv
        .slice(2)
        .map(arg => arg.split('='))
        .reduce((args, [value, key]) => {
            args[value] = key;
            return args;
        }, {});
  }

  function calculateHash(block) {
    let blockDetails = {
      previousBlockHash: block.previousBlockHash,
      data: block.data,
      blockNumber: block.blockNumber,
      timestamp: block.timestamp,
      nonce: block.nonce
    }
    return getSHA256HexString(JSON.stringify(blockDetails, Object.keys(blockDetails).sort()));
  }


  module.exports = {
    getSHA256HexString,
    parseArgs,
    calculateHash
  };

})();

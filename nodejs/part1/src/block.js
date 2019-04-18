"use strict";

(async () => {

  const Utils = require("./utils");

  function Block(blockNumber,data,nonce,previousBlockHash){
    this.blockNumber = blockNumber;
    this.data = data;
    this.nonce = nonce;
    this.previousBlockHash = previousBlockHash
    this.timestamp = Date.now()
    this.hash = "";
  }

  Block.prototype.incrementNonce = function() {
    this.nonce++;
    this.hash = Utils.calculateHash(this);
  }

  Block.prototype.toString = function() {
      let blockDetails = {
        previousBlockHash: this.previousBlockHash,
        data: this.data,
        blockNumber: this.blockNumber,
        timestamp: this.timestamp,
        nonce: this.nonce,
        blockHash: this.hash
      }
      return JSON.stringify(blockDetails, Object.keys(blockDetails).sort());
   };

  module.exports = Block;
})();

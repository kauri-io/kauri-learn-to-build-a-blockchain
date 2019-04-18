"use strict";

(async () => {

  const Consensus   = require('./consensus')
  const parse       = require('url-parse');


  function Blockchain(consensus,blocks){
    this.blocks = [] //the chain of blocks!
    if(blocks)
    {
      this.blocks = blocks;
    }
    this.peers = new Set(); //list of unique peers in the network
    this.consensus = consensus;
    //Create the genesis block
    this.newBlock("I am genesis!")
  }

  Blockchain.prototype.newBlock = function(data) {
    let previousBlockHash = "";
    let newBlockNumber = 0
    if(this.blocks.length>0) {
      previousBlockHash = this.blocks[this.blocks.length-1].hash;
      newBlockNumber = this.blocks.length;
    }
    let block = this.consensus.mineBlock(newBlockNumber,data,previousBlockHash);
    this.blocks.push(block);
    return block;
  }

  Blockchain.prototype.isValid = function() {
    let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
    while(currentblockNumber < this.blocks.length) {
      const currentBlock = this.blocks[currentblockNumber];
      const previousBlock = this.blocks[currentblockNumber - 1];

      // Check that previousBlockHash is correct
      if (currentBlock.previousBlockHash !== previousBlock.hash) {
        return false;
      }

      // check that the current blockHash is correct
      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check that the nonce (proof of work result) is correct
      if (!this.consensus.validHash(currentBlock.hash)) {
        return false;
      }
      currentblockNumber++;
    }

    return true;
  }

  Blockchain.prototype.registerPeer = function(address) {
    const host = parse(address).host;
    this.peers.add(host);
    console.log("Registered peer: "+host)
  }

  Blockchain.prototype.checkLongestChain = async function() {
    let result = await this.consensus.checkLongestChain(this.peers,this.blocks.length);
    if(result.newBlocks) {
      this.blocks = result.newBlocks;
      console.log("Chain replaced: "+this.blocks)
    }
    return result.isLongestChain;
  }

  module.exports = Blockchain;
})();

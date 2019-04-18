"use strict";

(async () => {

  const Block   = require('./block');
  const Utils   = require('./utils');
  const fetch   = require('node-fetch');

  function Consensus(){
    this.difficulty = 5;
    this.difficultyRegex = new RegExp('^0{'+this.difficulty+'}')
  }

  Consensus.prototype.mineBlock = function(blockNumber,data,previousBlockHash) {
    let block = new Block(blockNumber,data,0,previousBlockHash); //start the nonce at 0
    //while we have not got the correct number of leadings 0's (difficulty * 0) in our blockHash, keep incrimenting the blocks nonce
    while(!this.validHash(block.hash))
    {
      block.incrementNonce();
    }
    console.log("Mined new block: "+block.toString());
    return block;
  }

  Consensus.prototype.validHash = function(hash) {
    return this.difficultyRegex.test(hash);
  }

  Consensus.prototype.checkLongestChain = function(peers,length)
  {
    let promises = [];

    peers.forEach((host) => {
      promises.push(
        fetch('http://'+host+'/blocks')
          .then(res => {
            if (res.ok) {
              return res.json();
            }
          })
          .then(json => json)
      );
    });

    return Promise.all(promises).then((chains) => {
      let newBlocks = null;
      let longestLength = length;

      chains.forEach(({ blocks }) => {
        // Check if the length is longer and the chain is valid
        if (blocks.length > longestLength && this.isChainValid(blocks)) {
          longestLength = blocks.length;
          newBlocks = blocks;
        }
      });

      return { isLongestChain: !newBlocks, newBlocks: newBlocks };
    });
  }

  Consensus.prototype.isChainValid = function(blocks) {
    let currentblockNumber = 1; //start after the genesis block (blockNumber=0)
    while(currentblockNumber < blocks.length) {
      const currentBlock = blocks[currentblockNumber];
      const previousBlock = blocks[currentblockNumber - 1];

      // Check that previousBlockHash is correct
      if (currentBlock.previousBlockHash !== previousBlock.hash) {
        return false;
      }
      // check that the current blockHash is correct
      if(currentBlock.hash !== Utils.calculateHash(currentBlock)) {
        return false;
      }
      // Check that the nonce (proof of work result) is correct
      if (!this.validHash(currentBlock.hash)) {
        return false;
      }
      currentblockNumber++;
    }
    return true;
  }

  module.exports = Consensus;
})();

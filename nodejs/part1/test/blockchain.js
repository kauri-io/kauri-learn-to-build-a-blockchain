"use strict";

(async () => {
  // ########################################################################################################
  // ########################################################################################################
  // IMPORTS
  const assert      = require('assert');
  const Blockchain  = require('../src/blockchain');
  const Consensus   = require('../src/consensus');
  const Block       = require('../src/block');

  // ########################################################################################################
  // ########################################################################################################
  //
  var blockchain;
  var consensus;
  const BLOCK_TIMEOUT = 60000;

  // ########################################################################################################
  // ########################################################################################################
  // TESTS
  describe('Blockchain tests',  function() {
    this.timeout(BLOCK_TIMEOUT*4);

    beforeEach(async function() {
      consensus = new Consensus();
      blockchain = new Blockchain(consensus);
    });

    it('Should create a genesis block when created',  function() {

      assert.strictEqual(blockchain.blocks.length, 1);
      assert.strictEqual(blockchain.blocks[0].data, "I am genesis!");
      assert.strictEqual(blockchain.blocks[0].blockNumber, 0);
    });

    it('Should add new valid block',  function() {
      blockchain.newBlock("some data");
      assert.strictEqual(blockchain.blocks.length, 2);
      assert.strictEqual(blockchain.blocks[1].data, "some data");
      assert.strictEqual(blockchain.blocks[1].blockNumber, 1);
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
      blockchain.newBlock("some more data");
      assert.strictEqual(blockchain.blocks.length, 3);
      assert.strictEqual(blockchain.blocks[2].data, "some more data");
      assert.strictEqual(blockchain.blocks[2].blockNumber, 2);
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
    });

    it('Should fail to validate blockchain if new block addded with incorrect previous hash',  function() {
      blockchain.newBlock("some data");
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
      let block = consensus.mineBlock(3,"some more data","INVALID_HASH");
      blockchain.blocks.push(block);
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), false);
    });

    it('Should fail to validate blockchain if data in a previous block is changed',  function() {
      blockchain.newBlock("some data");
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
      blockchain.newBlock("some more data");
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
      blockchain.blocks[1].data = "invalid data";
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), false);
    });

    it('Should fail to validate blockchain if a previous block is swaped for another',  function() {
      blockchain.newBlock("some data");
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
      blockchain.newBlock("some more data");
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), true);
      let block = consensus.mineBlock(2,"some data",blockchain.blocks[0].hash); //regenerating the block should result in a different block hash
      blockchain.blocks[1] = block;
      assert.strictEqual(consensus.isChainValid(blockchain.blocks), false);
    });

  });
})();

"use strict";

(async () => {
  // ########################################################################################################
  // ########################################################################################################
  // IMPORTS
  const assert  = require('assert');
  const Consensus   = require('../src/consensus')

  // ########################################################################################################
  // ########################################################################################################
  //
  var consensus;
  const BLOCK_TIMEOUT = 60000;

  // ########################################################################################################
  // ########################################################################################################
  // TESTS
  describe('Consensus tests',  function() {

    beforeEach(async function() {
      consensus = new Consensus();
    });

    it('Should correctly valdidate valid hash',  function() {
      let hashString = "000005622474hwbkvrwhj"
      assert.strictEqual(consensus.validHash(hashString), true);
    });

    it('Should fail to valdidate invalid hash',  function() {
      let hashString = "0005622474hwbkvrwhj"
      assert.strictEqual(consensus.validHash(hashString), false);
    });

    it('Should create a block with a valid hash',  function() {
      this.timeout(BLOCK_TIMEOUT);
      let block = consensus.mineBlock(0,"some data","PREVIOUS_HASH");
      assert.strictEqual(consensus.validHash(block.hash), true);
    });

  });
})();

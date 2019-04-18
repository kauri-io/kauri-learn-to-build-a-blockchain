"use strict";

(async () => {

  const Utils       = require("./utils");
  const Api         = require("./api");
  const Blockchain  = require('../src/blockchain');
  const Consensus   = require('../src/consensus');

  const DEFAULT_PORT = 5000;
  const args = Utils.parseArgs();

  const port = args.port || DEFAULT_PORT;

  let app = Api.getAPI(new Blockchain(new Consensus()));
  app.listen(port)
  console.log("Blockchain server listening on port: "+port)


})();

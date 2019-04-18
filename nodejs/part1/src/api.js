"use strict";



(async () => {

  const express     = require('express');
  const bodyParser  = require('body-parser');
  const multer      = require('multer');
  const Utils       = require('./utils');

  function getAPI(blockchain) {
    var app = express();
    const requestParser = multer();
    app.use(bodyParser.json());
    //app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.post('/mine', requestParser.array(), async (req, res) => {
      const { data }  = req.body || {};

      if (!data) {
        res.status(400).send('Error: Must set data in request');
        return;
      }

      await blockchain.checkLongestChain();

      let block = blockchain.newBlock(data);

      const response = {
        message: 'Mined new block',
        ...block
      };

      res.status(201).send(response);
    });

    app.get('/blocks', (req, res) => {
      const response = {
        blocks: blockchain.blocks,
        count: blockchain.blocks.length
      };

      res.send(response);
    });

    app.get('/peers', (req, res) => {
      const response = {
        peers: blockchain.peers,
        count: blockchain.peers.length
      };

      res.send(response);
    });

    app.post('/peers/add', requestParser.array(), (req, res) => {
      const { peers } = req.body || [];

      if (!peers) {
        res.status(400).send('Error: Must supply list of peers in field peers');
        return;
      }

      peers.forEach((peer) => {
        blockchain.registerPeer(peer);
      });

      const response = {
        message: 'New peers have been added',
        peers: JSON.stringify([...blockchain.peers]),
        count: blockchain.peers.size
      };

      res.status(201).send(response);
    });

    app.get('/peers/check', async (req, res) => {
      let response;
      let result = await blockchain.checkLongestChain();
      if(result) {
        response = {
          message: 'Chain is longest',
          newChain: blockchain.blocks
        };
      }
      else {
        response = {
          message: 'Chain updated',
          newChain: blockchain.blocks
        };
      }
      res.send(response);

    });

    return app;
  }

  module.exports = {
    getAPI
  }
})();

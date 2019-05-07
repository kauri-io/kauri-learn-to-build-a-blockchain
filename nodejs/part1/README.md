# kauri-learn-to-build-a-blockchain Part1: Blocks & Consensus

Source code for Kauri series of articles on [Creating a Blockchain | Blocks & Consensus](https://kauri.io/article/92034a0c23ed4cb4a6ca959e0a4b78b9/)

## Installation

1. Install [Node & NPM](https://nodejs.org)
2. Clone this respo
3. Run `npm install`

## Run

Start a node

```
node src/server.js port=<port>
```

Mine a block

```
curl -X POST "localhost:<port>/mine" -H 'Content-Type: application/json' -d'
{
    "data": "Mine a block on node 1"
}
'
```

Add peer to node

```
curl -X POST "localhost:<port>/peers/add"  -H 'Content-Type: application/json' -d'
{
    "peers":  ["http://<host>:<port>"]
}
'
```

## Contributing

Contributions are welcome! Please feel free to submit a PR and/or a [Kauri](https://kauri.io) article

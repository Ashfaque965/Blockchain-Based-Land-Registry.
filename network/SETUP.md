# Hyperledger Fabric Network Configuration

## Network Architecture

```
Organization: Org1
├── Peer: peer0.org1.example.com
├── Certificate Authority: ca.org1.example.com
└── Orderer: orderer.example.com

Channel: landregistrychannel
├── Chaincode: landregistry
└── Version: 1.0
```

## Setup Instructions

### 1. Install Hyperledger Fabric Binaries

```bash
cd network
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh | bash -s
```

### 2. Generate Certificates

```bash
./bin/cryptogen generate --config=./crypto-config.yaml
```

### 3. Generate Channel Configuration

```bash
./bin/configtxgen -profile OneOrgOrdererGenesis -channelID landregistrychannel -outputBlock ./channel-artifacts/genesis.block
./bin/configtxgen -profile OneOrgChannel -channelID landregistrychannel -outputCreateChannelTx ./channel-artifacts/channel.tx
```

### 4. Start Network

```bash
docker-compose -f docker-compose.yaml up -d
```

### 5. Create Channel

```bash
./bin/peer channel create -o orderer.example.com:7050 -c landregistrychannel -f ./channel-artifacts/channel.tx
```

### 6. Install and Instantiate Chaincode

```bash
./bin/peer lifecycle chaincode install ../chaincode/landRegistry/landRegistry.tar.gz
./bin/peer lifecycle chaincode instantiate -C landregistrychannel -n landregistry -v 1.0 -c '{"function":"init","Args":[]}'
```

## Environment Variables

Create a `.env` file in the network directory:

```
FABRIC_CFG_PATH=./config
CORE_PEER_TLS_ENABLED=true
CORE_PEER_LOCALMSPID=Org1MSP
CORE_PEER_TLS_ROOTCERT_FILE=./crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
```

## Troubleshooting

- **Connection refused**: Ensure Docker containers are running
- **Chaincode install failed**: Check chaincode version and format
- **Channel creation error**: Verify orderer is running and accessible

## Additional Resources

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [Fabric Network Configuration](https://hyperledger-fabric.readthedocs.io/en/latest/networkconfig.html)

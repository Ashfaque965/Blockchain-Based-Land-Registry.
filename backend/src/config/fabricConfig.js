const fs = require('fs');
const path = require('path');

module.exports = {
  network: {
    channelName: process.env.CHANNEL_NAME || 'landregistrychannel',
    chaincodeName: process.env.CHAINCODE_NAME || 'landregistry',
    chaincodeVersion: process.env.CHAINCODE_VERSION || '1.0'
  },
  
  connectionProfile: {
    name: 'land-registry-network',
    version: '1.0.0',
    client: {
      organization: 'Org1',
      connection: {
        timeout: {
          peer: {
            endorser: '300'
          },
          orderer: '300'
        }
      }
    },
    organizations: {
      Org1: {
        mspid: 'Org1MSP',
        peers: ['peer0.org1.example.com'],
        certificateAuthorities: ['ca.org1.example.com']
      }
    },
    peers: {
      'peer0.org1.example.com': {
        url: process.env.PEER_URL || 'grpcs://peer0.org1.example.com:7051',
        tlsCACerts: {
          path: process.env.PEER_TLS_CERT || '/path/to/peer-tlscacert.pem'
        },
        grpcOptions: {
          'ssl-target-name-override': 'peer0.org1.example.com'
        }
      }
    },
    certificateAuthorities: {
      'ca.org1.example.com': {
        url: process.env.CA_URL || 'https://ca.org1.example.com:7054',
        caName: 'ca-org1',
        tlsCACerts: {
          path: process.env.CA_TLS_CERT || '/path/to/ca-tlscacert.pem'
        }
      }
    }
  },
  
  walletPath: path.join(__dirname, '../../wallet'),
  
  userId: process.env.FABRIC_USER_ID || 'appUser',
  
  orgName: 'Org1',
  
  mspId: 'Org1MSP'
};

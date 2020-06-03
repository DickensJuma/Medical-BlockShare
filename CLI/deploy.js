const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile.js');

const provider = new HDWalletProvider(
  'analyst duty north sunny raw town above knock proud crumble awful live',
  'https://rinkeby.infura.io/GqOzNArFNDdCb90D0Dp1'
);

const web3 = new Web3(provider);

const deploy = async() =>{
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from address: ',accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface)).deploy({
    data: bytecode
  }).send({from: accounts[0], gas: 1500000});

  console.log('Contract deployed at: ', result.options.address);
};

deploy();

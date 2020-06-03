const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiled = require('./compile.js');
const fs = require('fs');
const ipfs = require('./addFileToIPFS.js');

let hash;

var addFunctionality = async () =>{
  var accounts = await web3.eth.getAccounts();
  var manager = accounts[0]; var patient = accounts[1]; var provider = accounts[2];

  medicalFactory = await new web3.eth.Contract(JSON.parse(compiled.factory.interface)).deploy({
    data: compiled.factory.bytecode
  }).send({
    from: manager,
    gas: 3500000
  });

await medicalFactory.methods.registerAsPatient("Shruthi", "Sivasubramanian", "13-04-95", "Brainerd").send({from: patient, gas: 3500000});
await medicalFactory.methods.registerAsProvider().send({from: provider, gas:3500000});
var patientContractAddr = await medicalFactory.methods.profiles(patient).call({from: patient, gas: 3500000});
var providerContractAddr = await medicalFactory.methods.profiles(provider).call({from: provider, gas: 3500000});
var patientContract = await new web3.eth.Contract(JSON.parse(compiled.patient.interface), patientContractAddr);
var providerContract = await new web3.eth.Contract(JSON.parse(compiled.provider.interface), providerContractAddr);

await providerContract.methods.addPatient(patientContractAddr).send({from: provider,gas: 3500000});
await patientContract.methods.getRequests().call({from:patient});
await patientContract.methods.acceptProvider(0).send({from: patient,gas: 3500000});
await patientContract.methods.addedProviders(0).call({from:patient});

await ipfs.addFile('record.txt', async function(res){
  hash = await web3.utils.fromAscii(res);
  await patientContract.methods.uploadFiles(hash).send({
    from: patient,
    gas: 3500000
  });
  var files = await patientContract.methods.getFiles(0).call({from: patient});
  var newHash = await web3.utils.toAscii(files);

  console.log(`files: ${newHash}`);

  //await patientContract.methods.getFiles(0).call({from:patient}).then(console.log);

  await ipfs.addFile('vigilante.txt', async function(res){
    hash = await web3.utils.fromAscii(res);
    await providerContract.methods.uploadFiles(hash, patientContractAddr).send({
      from: provider,
      gas: 3500000
    });
    //console.log(`Files added! Here's your hash: ${res}`);

    await patientContract.methods.getFiles(1).call({from:patient, gas: 3500000}).then(console.log);
    await providerContract.methods.getFiles(1, patientContractAddr).call({from: provider,gas: 5500000}).then(console.log);
  });




  // // var hashn = await web3.utils.toAscii(b);
  // // console.log(`B:,${hashn}`);
  //console.log(bytes);
});

//await patientContract.methods.addedProvidersAccess(providerContractAddr).call({from:patient}).then(console.log);







};
addFunctionality();

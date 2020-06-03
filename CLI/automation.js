global.ganache = require('ganache-cli');
global.Web3 = require('web3');
global.web3 = new Web3(ganache.provider());
global.compiled = require('./compile.js');
global.fs = require('fs');
global.ipfs = require('./addFileToIPFS.js');

fs.readFile('vigilante.txt', 'utf8', function(err,data){
  console.log(data);
  console.log("WELCOME TO MEDICAL BLOCKCHAIN CLI");
});


global.createFactory = async () => {
  global.accounts = await web3.eth.getAccounts();
  global.manager = accounts[0]; global.patient = accounts[1]; global.provider = accounts[2];

  global.medicalFactory = await new web3.eth.Contract(JSON.parse(compiled.factory.interface)).deploy({
    data: compiled.factory.bytecode
  }).send({
    from: manager,
    gas: 3500000
  });

  console.log(`Created factory at: ${medicalFactory.options.address}`);
  console.log(`Factory Manager: ${manager}`);
}

global.registerAsPatient = async(first, last, dob, addr) =>{
  var v = await medicalFactory.methods.registerAsPatient(first, last, dob, addr).send({from: patient, gas: 3500000});
  var patientContractAddr = await medicalFactory.methods.profiles(patient).call({from: patient, gas: 3500000});
  global.patientContract = await new web3.eth.Contract(JSON.parse(compiled.patient.interface), patientContractAddr);
  console.log(`You have been registered as a patient, ${first}!`);
  console.log(`Your contract address is: ${patientContractAddr}`);
}

global.myAddress = async(person) =>{
  var ContractAddr = await medicalFactory.methods.profiles(person).call({from: patient, gas: 3500000});
  console.log(`Your contract is at: ${ContractAddr}`);
}

global.registerAsProvider = async() =>{
  await medicalFactory.methods.registerAsProvider().send({from: provider, gas:3500000});
  var providerContractAddr = await medicalFactory.methods.profiles(provider).call({from: provider, gas: 3500000});
  global.providerContract = await new web3.eth.Contract(JSON.parse(compiled.provider.interface), providerContractAddr);
  console.log(`You have been registered as a provider!`);
  console.log(`Your contract address is: ${providerContractAddr}`);

}

global.patientAddFile = async(name) =>{
  await ipfs.addFile(name, async function(res){
    hash = await web3.utils.fromAscii(res);
    await patientContract.methods.uploadFiles(hash).send({
      from: patient,
      gas: 1000000
    });
    global.l = await patientContract.methods.numberOfFiles().call({from:patient});
    var files = await patientContract.methods.getFiles(l-1).call({from: patient});
    var newHash = await web3.utils.toAscii(files);
    console.log(`Files added! Here's your hash: ${newHash}`);
  });
}

global.patientGetFile = async(index, operation) =>{
  var file = await patientContract.methods.getFiles(index).call({from: patient});
  var hash = await web3.utils.toAscii(file);
  await ipfs.getFile(hash, async function(data){
    if(operation == 'download'){
      fs.writeFile('patientRecord', data, (err)=>{
        if(err) throw err;
      });
    }
    else if(operation == 'read'){
      console.log(data);
    }
  });
}

global.addProvider = async(providerAddress) =>{
  await patientContract.methods.addProvider(providerAddress).send({
    from: patient,
    gas: 3500000
  });
  console.log(`Added provider ${providerAddress}!`);
}

global.patientSeeRequests = async() =>{
  var requests = await patientContract.methods.getRequests().call({from: patient});
  console.log(`Your requests: ${requests}`);

}

global.addPatient = async(patientAddress) =>{
  await providerContract.methods.addPatient(patientAddress).send({
    from: provider,
    gas: 3500000
  });
  console.log(`Added patient ${patientAddress}`);
}

global.providerSeeRequests = async() =>{
  var requests = await providerContract.methods.pendingRequests().call({from: provider});
  console.log(`Your requests: ${requests}`);
}

global.patientAcceptRequest= async(index) =>{
  var request = await patientContract.methods.requests(index).call({from: patient});
  await patientContract.methods.acceptProvider(index).send({
    from: patient,
    gas: 3500000
  });
  console.log(`${request} has now been added as an approved provider!`);
}

global.providerAcceptRequest = async(index) =>{
  var request = await providerContract.methods.requests(index).call({from: provider});
  await providerContract.methods.acceptPatient(index).send({
    from: provider,
    gas: 3500000
  });
  console.log(`${request} has now been added as an approved patient!`)
}

global.seeApprovedProviders = async() =>{
  var approvedProviders = await patientContract.methods.providerList().call({from: patient});
  console.log(`Your approved providers: ${approvedProviders}`);
}

global.seeApprovedPatients = async() => {
  var approvedPatients = await providerContract.methods.patientList().call({from:provider});
  console.log(`Your approved patients: ${approvedPatients}`);
}

global.isHeMyProvider = async(providerAddress) =>{
  var bool = patientContract.methods.addedProvidersAccess(providerAddress).call({from: patient});
  if(bool){
    console.log(`${providerAddress} is an approved provider`);
  }
  else{
    console.log(`${providerAddress} is not an approved provider`);
  }

}

global.isHeMyPatient = async(patientAddress) =>{
  var bool = providerContract.methods.patients(patientAddress).call({from: provider});

  if(bool){
    console.log(`${patientAddress} is an approved patient`);
  }
  else{
    console.log(`${patientAddress} is not an approved patient`);
  }
}

global.haveISentARequestToPatient = async(patientAddress) =>{
  var bool = providerContract.methods.sentRequests(patientAddress).call({from: provider});
  if(bool){
    console.log(`Yes, you have`);
  }
  else{
    console.log(`No, you haven't`);
  }
}

global.haveISentARequestToProvider = async(providerAddress) =>{
  var bool = patientContract.methods.sentRequests(providerAddress).call({from: patient});
  if(bool){
    console.log(`Yes, you have`);
  }
  else{
    console.log(`No, you haven't`);
  }
}

global.uploadPatientFile = async(name, patientAddress) => {
  if(typeof patientAddress == undefined){
    console.log("Enter a valid patient address and try again.");
  }
  await ipfs.addFile(name, async function(res){
    hash = await web3.utils.fromAscii(res);
    await providerContract.methods.uploadFiles(hash, patientAddress).send({
      from: provider,
      gas: 3500000
    });
    console.log(`Files added! Here's your hash: ${res}`);
  });

}

global.seePatientFiles = async(index, patientAddress, operation) =>{
  var bytes = await providerContract.methods.getFiles(index, patientAddress).call({from: provider,
    gas: 3500000
  })
  var hash = await web3.utils.toAscii(bytes);

  await ipfs.getFile(hash, async function(data){
    if(operation == 'download'){
      fs.writeFile('patientRecord2', data, (err)=>{
        if(err) throw err;
      });
    }
    else if(operation == 'read'){
      console.log(data);
    }
  });
}

global.downloadAllFiles_provider = async(patientAddress) =>{
  var i = global.l -1;
  while (i >=0){

    var bytes = await providerContract.methods.getFiles(i, patientAddress).call({from: provider,
      gas: 3500000
    })
    var hash = await web3.utils.toAscii(bytes);

    await ipfs.getFile(hash, async function(data){

    await fs.writeFile(`patientRecord${i+1}.txt`, data, (err)=>{
      if(err) throw err;
      i = i-1;
    });

    });
  }
}

global.downloadAllFiles_patient= async() =>{
  var i = global.l -1;
  while (i >=0){
    await patientContract.methods.getFiles(i).call({from: patient,
      gas: 3500000
    }).then(async function(bytes){
      var hash = await web3.utils.toAscii(bytes);
      await ipfs.getFile(hash, async function(data){

        await fs.writeFileSync(`patientRecord${i+1}.txt`, data, (err)=>{
          if(err) throw err;
          i = i-1;
      });
    });


    });
  }
}

//global.automation = new Helpers();

// Start repl
require('repl').start({})

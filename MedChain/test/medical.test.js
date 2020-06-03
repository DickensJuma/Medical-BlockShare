const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledMedical = require('../ethereum/build/MedicalFactory.json');
const compiledPatient = require('../ethereum/build/Patient.json');
const compiledProvider = require('../ethereum/build/Provider.json');

let accounts, factory, patientAddress, patient, providerAddress, provider;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledMedical.interface))
    .deploy({ data: compiledMedical.bytecode})
    .send({ from: accounts[0], gas: '3500000' });

  await factory.methods.registerAsPatient("Abhay", "Sarda", "11-02-94", "90 Brainerd Road").send({
    from: accounts[2], gas: '3500000'
  });
  patientAddress = await factory.methods.profiles(accounts[2]).call();

  await factory.methods.registerAsProvider().send({
    from: accounts[1], gas: '3500000'
  });

  providerAddress = await factory.methods.profiles(accounts[1]).call();

  patient = await new web3.eth.Contract(
    JSON.parse(compiledPatient.interface),
    patientAddress
  );

  provider = await new web3.eth.Contract(
    JSON.parse(compiledProvider.interface),
    providerAddress
  );

});

describe('Campaigns', () =>{

  it('Deploys a factory, a patient and a provider contract!', () => {
    assert.ok(factory.options.address);
    assert.ok(patient.options.address);
    assert.ok(provider.options.address);
  });

  it('Creates a new contract with the manager set to the caller, for both patient and provider contracts.', async () => {
    const manager = await provider.methods.owner().call();
    assert.equal(manager, accounts[1]);
    const patientOwner = await patient.methods.owner().call();
    assert.equal(patientOwner, accounts[2]);
  });

  it('After registering as a new patient/provider, I can retrieve my contract address.', async () => {
    const patientAdd = await factory.methods.profiles(accounts[2]).call();
    const providerAdd = await factory.methods.profiles(accounts[1]).call();
    assert.equal(patientAdd, patientAddress);
    assert.equal(providerAdd, providerAddress);
  });

  it('After adding a patient to the list, the patient gets a new request.', async () => {

    await provider.methods.addPatient(patientAddress).send({
      from: accounts[1], gas: '3500000'
    });
    const requestPresent = await provider.methods.sentRequests(patientAddress).call();
    assert(requestPresent);

    const requests = await patient.methods.requests(0).call();
    assert.equal(requests, providerAddress);
  });

  it('After a patient accepts the request, the provider gets marked as an approved provider.', async() => {

    await provider.methods.addPatient(patientAddress).send({
      from: accounts[1], gas: '3500000'
    });
    const request = await patient.methods.requests(0).call();

    await patient.methods.acceptProvider(0).send({
      from: accounts[2] , gas: '3500000'
    });

    var approvedProvider = await patient.methods.addedProviders(0).call();
    assert.equal(approvedProvider, providerAddress);
  });

  it('After a patient adds a provider to the list, the provider gets a new request.', async () => {

    await patient.methods.addProvider(providerAddress).send({
      from: accounts[2], gas: '3500000'
    });
    const requestPresent = await patient.methods.sentRequests(providerAddress).call();

    const requests = await provider.methods.requests(0).call();

    assert.equal(requests, patientAddress);
  });

  it('After a provider accepts the request, the patient gets added as a patient.', async() => {

    await patient.methods.addProvider(providerAddress).send({
      from: accounts[2], gas: '3500000'
    });

    const request = await provider.methods.requests(0).call();

    await provider.methods.acceptPatient(0).send({
      from: accounts[1] , gas: '3500000'
    });

     const approvedPatient = await provider.methods.patientAddresses(0).call();
     assert.equal(approvedPatient, patientAddress);
  });

  it('A patient can upload and retrieve files', async() => {

    await patient.methods.uploadFiles(web3.utils.asciiToHex("Abhay")).send({
      from: accounts[2], gas: '3500000'
    });
    const file = await patient.methods.getFiles(0).call({
      from: accounts[2]
    });
    assert.equal("Abhay",web3.utils.toUtf8(file));
  });

  it('A provider can upload and retrieve files for an approved patient', async ()=> {

        await provider.methods.addPatient(patientAddress).send({
          from: accounts[1], gas: '3500000'
        });

        await patient.methods.acceptProvider(0).send({
          from: accounts[2] , gas: '3500000'
        });

        await provider.methods.uploadFiles( web3.utils.asciiToHex("Abhay") , patientAddress).send({
          from: accounts[1], gas: '3500000'
        });

        const file = await provider.methods.getFiles(0, patientAddress).call({
          from: accounts[1]
        });

        assert.equal("Abhay", web3.utils.toUtf8(file));

  });
});

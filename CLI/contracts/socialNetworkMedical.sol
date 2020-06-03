pragma solidity ^0.4.18;

contract MedicalFactory{
    address owner;
    address[] patients;
    address[] providers;
    mapping(address => address) public profileAddress;
    modifier ownerOnly{
        require(msg.sender == owner);
        _;
    }


    function MedicalFactory(){
        owner = msg.sender;
    }

    function registerAsPatient() public{
        address newPatient = new Patient(msg.sender);
        patients.push(newPatient);
        profileAddress[msg.sender] = newPatient;

    }

    function registerAsProvider() public{
        address newProvider = new Provider(msg.sender);
        providers.push(newProvider);
        profileAddress[msg.sender] = newProvider;

    }

    function seeRegisteredPatients() ownerOnly public view returns(address[]){
        return patients;
    }

    function seeRegisteredProviders() ownerOnly public view returns(address[]){
        return providers;
    }

}


contract Patient{

    address[] public addedProviders;
    mapping(address=>bool) public sentRequests;
    address[] public requests;
    address owner;
    bytes[] public patientFiles;

    modifier ownerOnly{
        require(msg.sender == owner);
        _;
    }

    function Patient(address _owner) public{
        owner = _owner;
    }

    function _addAddedProviders(address _providerAddress) {
        sentRequests[_providerAddress] = false;
        addedProviders.push(_providerAddress);
    }

    function _providerRequests(address _providerAddress){
        requests.push(_providerAddress);
    }

    function seeRequests() public view returns(address[]){
        return requests;
    }

    function uploadFile(bytes _hash) ownerOnly public{
        patientFiles.push(_hash);
    }

    function retrieveFile(bytes _hash) ownerOnly public returns(bytes){
        return _hash;
    }

    function addProvider(address _providerAddress) ownerOnly public{
        Provider provider = Provider(_providerAddress);
        require(sentRequests[_providerAddress]!=true);
        provider._patientRequests(this);
        sentRequests[_providerAddress] = true;
        requests.push(_providerAddress);
    }


    function RequestsForApproval() ownerOnly public view returns (address[]) {
        return requests;
    }

    function acceptProvider(uint _index) ownerOnly public{
        Provider provider = Provider(requests[_index]);
        addedProviders.push(requests[_index]);
        delete requests[_index];
        provider._addAddedPatients(this);
    }
}




contract Provider{
    address[] public addedPatients;
    address[] requests;
    mapping (address=>bool) sentRequests;
    address owner;

    modifier ownerOnly{
        require(msg.sender == owner);
        _;
    }

    function Provider(address _owner) public{
        owner = _owner;
    }

    function _addAddedPatients(address _patientAddress){
        sentRequests[_patientAddress] = false;
        addedPatients.push(_patientAddress);
    }

    function _patientRequests(address _patientAddress) {

        requests.push(_patientAddress);
    }

    function addPatient(address _patientAddress) ownerOnly{
        Patient patient = Patient(_patientAddress);
        require(sentRequests[_patientAddress]!=true);
        patient._providerRequests(this);
        sentRequests[_patientAddress] = true;
    }

    function RequestsForApproval() ownerOnly public view returns (address[]){
        return requests;
    }

    function acceptPatient(uint _index) ownerOnly public{
        Patient patient = Patient(requests[_index]);
        addedPatients.push(requests[_index]);
        delete requests[_index];
        patient._addAddedProviders(this);
    }

}

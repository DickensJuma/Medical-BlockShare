pragma solidity ^0.4.22;

contract MedicalFactory{

  address[] public providers;

  uint public providerCount;

  mapping (address => address) public profiles;
  mapping (address => bool) profileExists;

  function registerAsPatient(string _firstName, string _lastName, string _dateOfBirth, string _addressResidence) public {
    require(!profileExists[msg.sender]);
    address newPatient = new Patient(_firstName, _lastName, _dateOfBirth, _addressResidence, msg.sender);
    profiles[msg.sender] = newPatient;
    profileExists[msg.sender] = true;
  }

  function registerAsProvider() public {
    require(!profileExists[msg.sender]);
    address newProvider = new Provider(msg.sender);
    providers.push(newProvider);
    profiles[msg.sender] = newProvider;
    profileExists[msg.sender] = true;
    providerCount++;
  }
}

contract Provider {

    mapping (address => bool) patients;

    address[] patientAddresses;

    address[] public requests;

    mapping (address=>bool) sentRequests;

    uint public numberOfPatients;

    address public owner;

    modifier ownerOnly{
      require(msg.sender == owner);
      _;
    }

    constructor(address _owner) public {
      owner = _owner;
    }

    function addPatient(address _patientAddress) public ownerOnly {
      require(!sentRequests[_patientAddress]);
      Patient patient = Patient(_patientAddress);
      patient._providerRequests(this);
      sentRequests[_patientAddress] = true;
    }

    function acceptPatient(uint _index) public ownerOnly {
      Patient patient = Patient(requests[_index]);
      patientAddresses.push(requests[_index]);
      delete requests[_index];
      patient._clearRequest(this);
      numberOfPatients++;
    }

    function pendingRequests() public ownerOnly view returns (address[]) {
      return requests;
    }

    function patientList() public ownerOnly view returns (address[]) {
      return patientAddresses;
    }

    function _clearRequest(address _patientAddress) public {
      sentRequests[_patientAddress] = false;
      patientAddresses.push(_patientAddress);
      numberOfPatients++;
    }

    //Allow providers to send a request
    function _patientRequest(address _patientAddress) public {
      requests.push(_patientAddress);
    }

    function uploadFiles(bytes _ipfsHash, address _patientAddress) public ownerOnly {
        Patient patient = Patient(_patientAddress);
        patient.uploadFiles(_ipfsHash);
    }

    function getFiles(uint _index, address _patientAddress) public ownerOnly view returns (bytes) {
        Patient patient = Patient(_patientAddress);
        bytes memory file = patient.getFiles(_index);
        return file;
    }
}

contract Patient{

    struct Identity {
        string firstName;
        string lastName;
        string dateOfBirth;
        string addressResidence;
    }

    Identity identity;

    address owner;

    address[] public addedProviders;

    mapping (address => bool) public addedProvidersAccess;

    mapping (address => bool) public sentRequests;

    address[] requests;

    bytes[] files;

    uint public numberOfMedicalProviders;

    modifier ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    modifier restricted(){
        require(msg.sender == owner || addedProvidersAccess[msg.sender]);
        _;
    }

    constructor(string _firstName, string _lastName, string _dateOfBirth, string _addressResidence, address _owner) public {
        identity.firstName = _firstName;
        identity.lastName = _lastName;
        identity.dateOfBirth = _dateOfBirth;
        identity.addressResidence = _addressResidence;
        owner = _owner;
        numberOfMedicalProviders = 0;
    }

    function _clearRequest(address _providerAddress) public {
      sentRequests[_providerAddress] = false;
      addedProviders.push(_providerAddress);
      addedProvidersAccess[_providerAddress] = true;

    }

    function _providerRequests(address _providerAddress) public {
      requests.push(_providerAddress);
    }

    function getRequests() ownerOnly public view returns(address[]){
      return requests;
    }

    function addProvider(address _providerAddress)  public ownerOnly {
      require(!addedProvidersAccess[_providerAddress]);
      Provider provider = Provider(_providerAddress);
      provider._patientRequest(this);
      sentRequests[_providerAddress] = true;
      numberOfMedicalProviders++;
    }

    function acceptProvider(uint _index) public ownerOnly {
      Provider provider = Provider(requests[_index]);
      addedProviders.push(requests[_index]);
      numberOfMedicalProviders++;

      delete requests[_index];
      provider._clearRequest(this);

    }

    function uploadFiles(bytes ipfsHash) public restricted {
        files.push(ipfsHash);
    }

    function getFiles(uint _index) public restricted view returns (bytes) {
        return files[_index];
    }

    function returnIdentity() public ownerOnly view returns (string, string, string, string) {
        return (identity.firstName, identity.lastName, identity.dateOfBirth, identity.addressResidence);
    }
}

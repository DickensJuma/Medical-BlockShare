const path = require('path');
const fs = require('fs');
const solc = require('solc');

const medicalPath = path.resolve(__dirname, 'contracts', 'medical.sol');
const source = fs.readFileSync(medicalPath, 'utf8');

module.exports.factory = solc.compile(source, 1).contracts[':MedicalFactory'];
module.exports.patient = solc.compile(source, 1).contracts[':Patient'];
module.exports.provider = solc.compile(source, 1).contracts[':Provider'];

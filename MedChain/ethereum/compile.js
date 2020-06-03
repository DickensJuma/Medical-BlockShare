const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Delete the existing build folder, and compile the contract again.
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const medicalPath = path.resolve(__dirname, 'contracts', 'Medical.sol');
const source = fs.readFileSync(medicalPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':','') + '.json'),
    output[contract]
  );
}

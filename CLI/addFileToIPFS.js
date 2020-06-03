var fs = require('fs');

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

var addFile = (path, callback) => {

  fs.readFile(path, 'utf8', async function(err, contents){
    const randomData = await contents;
    console.log("Reading data from file...")
    ipfs.add(randomData, async (err, hash) => {
     if (err) {
       return console.log(err);
     }
     callback(hash);


     // console.log('Adding your file to ipfs...')
     // await console.log("Added. HASH: ", hash);

    });
  });

};

var getFile = (hash, callback) =>{
  console.log("Fetching your data...");
//  **** TO READ FILE***
  ipfs.cat(hash, (err, data) => {
    if (err) {
      return console.log(err);
    }
    console.log('Done!');
    callback(data);
  });
};

module.exports.addFile = addFile;
module.exports.getFile = getFile;


//addFile('vigilante.txt', console.log);
 // random bytes for testing
//getFile('QmUXTtySmd7LD4p6RG6rZW6RuUuPZXTtNMmRQ6DSQo3aMw', console.log);
//const hash = 'QmUXTtySmd7LD4p6RG6rZW6RuUuPZXTtNMmRQ6DSQo3aMw';

const IOTA = require('iota.lib.js')
const util = require('util')
const proc = require('child_process')
const exec = util.promisify(proc.exec)

const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' })

//Generates a new address for a given seed
function getAddress(seed) {

    return new Promise(async(resolve, reject) => {
        let address = iota.api.getNewAddress(seed, { index: 0, total: 1, security: 2, checksum: true, returnAll: false }, (error, success) => {
            if (error) {
                console.log(error)
                reject(error);
            } else {
                resolve(success);
            }
        });
    });
}

//Generates a new random seed on windows with powershell 
//function from https://github.com/bmavity/iota-seed-generator/blob/f6fc74777925f281c2fa829263fc7c7dc04e6f30/index.js#L71 
function newWindowsSeed() {
    // return new Promise(async(resolve, reject) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await exec('powershell.exe -Command "-join ([char[]](65..90+57..57)*100 | Get-Random -Count 81)"')

            if (result.stdout) {
                const textContainingSeed = result.stdout.replace('\r\n', '')
                const textParts = textContainingSeed.split('\n')

                resolve(textParts.pop())
            } else {
                reject(result.stderr)
            }
        } catch (err) {
            reject(err)
        }
    })
};

//Async Function 
async function asyncCall() {

    //lets you know you have entered 

    console.log('\nWelcome to the IOTA Seed & Address Generator\n');

    var newSeed = await newWindowsSeed();

    //feedback to know we are creating the new SEEED
    console.log('\nCreated new seed: ' + newSeed);

    var address = await getAddress(newSeed);

    //feedback with new address from new seed
    console.log('\nGot Address from seed: ' + address[0]);
}

var res = asyncCall();
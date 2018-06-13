let raspi = require('raspi');
let gpio = require('raspi-gpio');
let Promise = require("bluebird");
let conv = require('decimal-to-binary-converter');

let ledPins = [];
module.exports.initialize = (pins) => {
  return new Promise((resolve, reject) => {
    for(let i=0; i < pins.length; i++) {
      ledPins[i] = new gpio.DigitalOutput(pins[i]);
      ledPins[i].write(gpio.LOW);
    };
    return resolve('Initialization complete');
  });
}

module.exports.ledOutBinaryNumber = (number) => {
  return new Promise(async (resolve, reject) => {     
    let maxNumber = Math.pow(ledPins.length, 2) - 1;

    if(number > maxNumber) {
      return reject('The number specified is too high for the amount of pins. Max number is: ' + maxNumber);
    }
    
    let binaryArray = await intToBinaryArray(number);

    for(let i=0; i < binaryArray.length; i++) {
      ledPins[i].write(boolToLedOut(binaryArray[i]));
    };
    return resolve();
  });
}

intToBinaryArray = (number) => {
  return new Promise((resolve, reject) => {
    let binaryString = conv.converter(number);
    let binaryArray = binaryString.split('');
    let reversedBinaryArray = binaryArray.reverse();

    // shifts out the first char '.'
    reversedBinaryArray.shift();

    return resolve(reversedBinaryArray);
  });
}

boolToLedOut = (boolString) => {
  switch(boolString) {
    case '1':
      return gpio.HIGH;
    case '0':
      return gpio.LOW;
    default:
      return gpio.LOW;
  }
}

testCode = () => {
  raspi.init(async () => {   
    await module.exports.initialize(['GPIO22','GPIO27','GPIO17','GPIO4',]);
    await module.exports.ledOutBinaryNumber(16).catch( err => { console.log(err) });
  });
}

testCode();
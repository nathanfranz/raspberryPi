let raspi = require('raspi');
let pwm = require('raspi-pwm');
let Promise = require("bluebird");

let pwmPin;
module.exports.initialize = (pin) => {
  return new Promise((resolve, reject) => {
    if(!pin) {
      // Defaults to GPIO18
      pwmPin = new pwm.PWM();
    }
    else {
      pwmPin = new pwm.PWM(pin);
    }
    return resolve('Initialization complete');
  });
}

module.exports.setDutyCycle = (dutyCycle) => {
  return new Promise(async (resolve, reject) => {     
    pwmPin.write(dutyCycle);
    return resolve();
  });
}

testCode = () => {
  raspi.init(async () => {   
    await module.exports.initialize();
    while (true) {
      await module.exports.setDutyCycle(.2).catch( err => { console.log(err) });
    }   
  });
}

testCode();
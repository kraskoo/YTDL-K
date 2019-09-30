const fs = require('fs');
const info = require('./info');
const parser = require('./arguments-parser');
let parameters = {};

module.exports = function () {
  if (Object.keys(parameters).length === 0) {
    let args = process.argv;
    if (args.length < 3) {
      info();
      process.exit(0);
    }
  
    try {
      parameters = parser(process.argv);
    } catch (e) {
      console.log(`${e.message}\n`);
      info();
      process.exit(1);
    }
  
    if (!fs.existsSync(parameters.output)) {
      fs.mkdirSync(parameters.output);
    }
  
    if (!parameters.list) {
      if (parameters.trackNumber) {
        parameters.trackNumber = `${parameters.trackNumber} - `;
      }
    }
  }

  return parameters;
}();
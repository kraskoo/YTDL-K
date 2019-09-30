const https = require('https');
const fs = require('fs');
const jsdom = require('jsdom');
const info = require('./utils/info');
const parser = require('./utils/arguments-parser');
const args = process.argv;
if (args.length < 3) {
  info();
  return;
}

let parameters = {};
try {
  parameters = parser(args);
} catch (e) {
  console.log(`${e.message}\n`);
  info();
  return;
}

if (!fs.existsSync(parameters.output)) {
  fs.mkdirSync(parameters.output);
}

const resolvers = require('./utils/resolvers')(parameters);
const { downloadFile, resolveOneByOne } = resolvers;

if (!parameters.list) {
  let url = parameters.url;
  let trackNumber = '';
  if (parameters.trackNumber) {
    trackNumber = `${parameters.trackNumber} - `;
  }

  resolvers.modifyParameters(parameters);
  resolveOneByOne(downloadFile(url, trackNumber));
  return;
}

let chunks = '';
let urlQueryList = parameters.url
  .split('?')[1]
  .split('&')
  .filter(x => x.startsWith('list='))[0];
let playListUrl = `https://www.youtube.com/playlist?${urlQueryList}`;
https.get(playListUrl, res => {
  if (res.statusCode === 200) {
    res.on('data', data => {
      chunks += data;
    }).on('end', function () {
      let dom = new jsdom.JSDOM(chunks);
      let window = dom.window;
      window.addEventListener('load', require('./utils/helpers')(resolvers));
    });
  }
}).on('error', console.error);
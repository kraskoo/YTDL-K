const https = require('https');
const jsdom = require('jsdom');
const parameters = require('./utils/parameters');
const { downloadFile, resolveOneByOne } = require('./utils/resolvers');
const { onLoadedPage } = require('./utils/helpers');

if (!parameters.list) {
  resolveOneByOne(downloadFile(parameters.url, parameters.trackNumber ? parameters.trackNumber : ''));
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
      window.addEventListener('load', onLoadedPage);
    });
  } else {
    console.log(`Status code: ${res.statusCode}\n${res.statusMessage}`);
  }
}).on('error', console.error);
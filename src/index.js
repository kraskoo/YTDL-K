const ytpl = require('ytpl');
const parameters = require('./utils/parameters');
const { downloadFile, resolveOneByOne } = require('./utils/resolvers');

if (!parameters.list) {
  resolveOneByOne(downloadFile(parameters.url, parameters.trackNumber ? parameters.trackNumber : ''));
  return;
}

let urlQueryList = parameters.url
  .split('?')[1]
  .split('&')
  .filter(x => x.startsWith('list='))[0]
  .split('=')[1];
ytpl(urlQueryList)
  .then(res => {
    var urls = res.items.map(tn => tn.shortUrl);
    var promises = [];
    for (let i = 0; i < urls.length; i++) {
      const currentIndexLength = `${i + 1}`.length;
      const currentIndex = `${'0'.repeat(`${urls.length}`.length - currentIndexLength)}${i + 1}`;
      promises.push(downloadFile(urls[i], `${currentIndex} - `));
    }
    
    resolveOneByOne(promises);
  }).catch(console.error);
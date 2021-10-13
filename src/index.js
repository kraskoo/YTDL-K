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
(async function () {
  const responses = [];
  const first = await ytpl(urlQueryList, { pages: 1 });
  const length = first.continuation.filter(c => typeof c === 'string').length - 1;
  responses.push(first);
  let next = first;
  for (let i = 0; i < length; i++) {
    next = await ytpl.continueReq(next.continuation);
    responses.push(next);
  }

  const urls = responses.map(r => r.items.map(i => i.shortUrl)).flat();
  const promises = [];
  for (let i = 0; i < urls.length; i++) {
    const currentIndexLength = `${i + 1}`.length;
    const currentIndex = `${'0'.repeat(`${urls.length}`.length - currentIndexLength)}${i + 1}`;
    promises.push(downloadFile(urls[i], `${currentIndex} - `));
  }
  
  resolveOneByOne(promises);
}())
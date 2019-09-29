let downloadFile = null;
let resolveOneByOne = null;

function onLoadedPage(ev) {
  let promises = [];
  let document = ev.target;
  let anchors = document.querySelectorAll('tr.pl-video > td.pl-video-thumbnail > span > a');
  let countLength = `${anchors.length}`.length;
  for (let i = 0; i < anchors.length; i++) {
    let href = anchors[i].href;
    if (!href.startsWith('http')) {
      href = `https://www.youtube.com${href}`;
    }

    href = href.replace(/&?t=\d*s&?/g, '');
    let indexPattern = /&?index=\d*&?/g;
    let indexMatches = href.match(indexPattern);
    if (indexMatches !== null) {
      let indexQuery = indexMatches[0];
      let hasTrailingAnd = indexQuery.endsWith('&');
      if (hasTrailingAnd) {
        indexQuery = indexQuery.substring(0, indexQuery.length - 1);
      }

      let queryParts = indexQuery.split('=');
      if (Number(queryParts[1]) !== i + 1) {
        queryParts[1] = `${i + 1}`;
        if (hasTrailingAnd) {
          queryParts[1] = `${queryParts[1]}&`;
        }
      }

      href = href.replace(indexPattern, queryParts.join('='));
    }

    const currentIndexLength = `${i + 1}`.length;
    const currentIndex = `${'0'.repeat((countLength - currentIndexLength))}${i + 1}`;
    promises.push(downloadFile(href, `${currentIndex} - `));
  }

  resolveOneByOne(promises);
}

module.exports = (resolvers) => {
  downloadFile = resolvers.downloadFile;
  resolveOneByOne = resolvers.resolveOneByOne;
  return onLoadedPage;
};
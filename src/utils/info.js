function info() {
  console.log('Usage:');
  console.log('node index [options...]');
  console.log('Options:');
  console.log('\tRequired:');
  console.log('\t\t-u, --url <YouTube Url> - link to YouTube page');
  console.log('\tOptional:');
  console.log(`\t\t-f, --format <Output format> - formats: (mp4, mp3) or (0, 1) - default: mp4`);
  console.log(`\t\t\tif you select mp3, it will be provided additional operation for converting mp4 to mp3`);
  console.log(`\t\t\tImportant: this operation slow down the whole process`);
  console.log(`\t\t-l, --list <List Option> - options: (false, true) or (0, 1) - default: false`);
  console.log(`\t\t\tif you select true, it will download automatically all URLs in given YouTube playlist`);
  console.log(`\t\t\tImportant: You need to provide YouTube URL including playlist in the query string`);
  console.log(`\t\t-tn, --track-number <Prefix> - prefixes: add number or anything else to the title of track - default: empty`);
  console.log(`\t\t\tImportant: Will not work for playlists`);
  console.log(`\t\t-o, --output <Path> - path: working directory for the app - default: './output'`);  
  console.log('Examples:');
  console.log(`\tnode index -u "https://www.youtube.com/watch?v=dp7D-nAS2WY&list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws",`);
  console.log(`\tnode index --url "https://www.youtube.com/watch?v=dp7D-nAS2WY" --track-number "01",\n`);
  console.log(`\tnode index -u "https://www.youtube.com/watch?v=dp7D-nAS2WY&list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true",`);
  console.log(`\tnode index --url "https://www.youtube.com/playlist?list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true" -o "D:\\"`);
}

module.exports = info;
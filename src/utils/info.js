const help = [
  'Usage:',
  'node index [options...]',
  'Options:',
  '\tRequired:',
  '\t\t-u, --url <YouTube Url> - link to YouTube page',
  '\tOptional:',
  `\t\t-f, --format <Output format> - formats: (mp4, mp3) or (0, 1) - default: mp4`,
  `\t\t\tif you select mp3, it will be provided additional operation for converting mp4 to mp3`,
  `\t\t\tImportant: this operation slow down the whole process`,
  `\t\t-l, --list <List Option> - options: (false, true) or (0, 1) - default: false`,
  `\t\t\tif you select true, it will download automatically all URLs in given YouTube playlist`,
  `\t\t\tImportant: You need to provide YouTube URL including playlist in the query string`,
  `\t\t-tn, --track-number <Prefix> - prefixes: add number or anything else to the title of track - default: empty`,
  `\t\t\tImportant: Will not work for playlists`,
  `\t\t-o, --output <Path> - path: working directory for the app - default: './output'`,
  `\t\t-s, --skip <Number> - Skip N tracks from playlist`,
  'Examples:',
  `\tnode index -u "https://www.youtube.com/watch?v=dp7D-nAS2WY&list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws",`,
  `\tnode index --url "https://www.youtube.com/watch?v=dp7D-nAS2WY" --track-number "01",\n`,
  `\tnode index -u "https://www.youtube.com/watch?v=dp7D-nAS2WY&list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true",`,
  `\tnode index --url "https://www.youtube.com/playlist?list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true" -o "D:\\"`,
  `\tnode index --url "https://www.youtube.com/playlist?list=PLX_17zp0nBu8yW3dhLyRVG_dQDHUUc-ws" -l "true" -s 35`
];

function info() {
  console.log(help.join('\n'));
}

module.exports = info;
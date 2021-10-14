const fs = require('fs');
const readline = require('readline');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');
const parameters = require('./parameters');
let totalMB = 0;

function downloadFile(url, listIndex = '') {
  let urlParts = url.split('&');
  let idElements = [];
  let id = '';
  for (let i = 0; i < urlParts.length; i++) {
    idElements = urlParts[i].split('?').filter(a => a.startsWith('v='));
    if (idElements.length > 0) {
      id = idElements[0].split('=')[1];
      url = `https://www.youtube.com/watch?v=${id}`;
    }
  }

  if (id !== '') {
    return {
      promise: () => new Promise(async (res, rej) => {
        let info = await ytdl.getInfo(url);
        res(info, id, listIndex);
      }),
      id,
      index: listIndex
    };
  } else {
    return {
      promise: () => new Promise((res, rej) => { }),
      id: '',
      index: -1
    };
  }
}

async function resolveOneByOne(promises, originalLength = null) {
  if (!Array.isArray(promises)) {
    promises = [ promises ];
  }
  
  for (let i = 0; i < promises.length; i++) {
    try {
      await resolveObject(promises[i], promises.length, originalLength);
    } catch (err) {
      console.error(err);
    }
  }

  console.log(`Total downloaded: ${(totalMB / 1024 / 1024).toFixed(2)}MB`);
}

async function resolveObject(obj, length = 1, originalLength = null) {
  try {
    let id = obj.id;
    let index = obj.index;
    if (length === 1) {
      index = '1';
    }

    console.log(`[${index.replace(' - ', '')} of ${originalLength ? originalLength : length}]...`);
    let info = await obj.promise();
    try {
      index = obj.index;
      let videoFile = await resolveInfo(info, id, index);
      if (parameters.format === 'mp3') {
        fs.unlink(videoFile, err => {
          if (err) {
            console.error(err);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
}

function resolveInfo(info, id, listIndex = '') {
  return new Promise((resolve, reject) => {
    const title = info['player_response']['videoDetails']['title'].replace(/[<>:"/\|?*]*/g, '');
    const videoFile = `${parameters.output}${listIndex}${title}.mp4`;
    const audioFile = `${parameters.output}${listIndex}${title}.mp3`;
    let isAppendedToTotal = false;
    ytdl(id, { quality: 'highest' })
      .on('error', console.error)
      .on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const current = (downloaded / 1024 / 1024);
        if (!isAppendedToTotal) {
          totalMB += total;
          isAppendedToTotal = !isAppendedToTotal;
        }

        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`'${title}' - ${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${current.toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`);
      })
      .pipe(fs.createWriteStream(videoFile))
      .on('finish', () => {
        console.log('\nDownload done.');
        if (parameters.format === 'mp3') {
          console.log('Converting...');
          ffmpeg(fs.createReadStream(videoFile))
            .setFfmpegPath(ffmpegPath)
            .fromFormat('mp4')
            .noVideo()
            .outputOptions(['-b:a 192k'])
            .output(fs.createWriteStream(audioFile))
            .toFormat('mp3')
            .on('error', reject)
            .on('progress', progress => {
              readline.cursorTo(process.stdout, 0);
              readline.clearLine(process.stdout, 1);
              process.stdout.write(progress.timemark)
            })
            .on('end', () => {
              console.log('\nConvert finished!\n');
              resolve(videoFile);
            })
            .run();
        } else {
          resolve(videoFile);
        }
      });
  });
}

module.exports = { downloadFile, resolveOneByOne };
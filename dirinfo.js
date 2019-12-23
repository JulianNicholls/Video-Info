const fs = require('fs');
const path = require('path');
const { ffprobe } = require('fluent-ffmpeg');
const { ljust, rjust } = require('justify-text');

const { parseData, humanSize, humanTime } = require('./videoData');

const dirname = process.argv[2];

fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }

  files.forEach(file => {
    if (!file.isDirectory()) {
      const fqfile = path.join(dirname, file.name);

      ffprobe(fqfile, (err, videodata) => {
        if (err) {
          return console.log(`${file.name} No data`);
        }

        const { duration, size, width, height } = parseData(videodata);

        const res = ljust(`${rjust(width.toString(), 4)}x${height}`, 9);
        const time = rjust(humanTime(duration), 7);
        console.log(`${ljust(file.name, 40)} ${res}  ${time}  ${humanSize(size)}`);
      });
    }
  });
});

const fs = require('fs');
const path = require('path');
const { ljust, rjust } = require('justify-text');

const { spawnFFProbe, parseData, humanSize, humanTime } = require('./videoData');

const readImages = dirname => {
  let images = [];

  const dir = fs.opendirSync(dirname);
  let file;

  while ((file = dir.readSync())) {
    if (!file.isDirectory()) {
      const fqfile = path.join(dirname, file.name);

      const reply = spawnFFProbe(fqfile);

      const { duration, size, width, height } = parseData(reply.data);

      images.push({ name: file.name, duration, size, width, height });
    }
  }

  return images;
};

const main = dirname => {
  const images = readImages(dirname);

  images.forEach(({ name, width, height, duration, size }) => {
    const res = ljust(`${rjust(width.toString(), 4)}x${height}`, 9);
    const time = rjust(humanTime(duration), 7);

    console.log(
      `${ljust(name, 40)} ${res}  ${time}  ${rjust(humanSize(size), 8)}`
    );
  });
};

const dirname = process.argv[2];

main(dirname);

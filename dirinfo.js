const fs = require('fs');
const path = require('path');
const { ljust, rjust } = require('justify-text');

const { spawnFFProbe, parseData, humanSize, humanTime } = require('./videoData');
const { setOptions } = require('./options');

const options = {
  dirname: '',
  minSize: 0,
  maxSize: 0,
  minLength: 0,
  maxLength: 0,
  minHeight: 0,
  maxHeight: 0,
};

const readImages = dirname => {
  let images = [];

  try {
    const dir = fs.opendirSync(dirname);
    let file;

    while ((file = dir.readSync())) {
      if (!file.isDirectory()) {
        const fqfile = path.join(dirname, file.name);
        const reply = spawnFFProbe(fqfile);
        const { duration, size, width, height } = parseData(reply.data);

      images.push({ name: file.name, duration, size, width, height });
    }
  } catch (err) {
    console.error(`Cannot open ${dirname}`);
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

setOptions(process.argv, options);

// console.log({ options });

// const dirname = process.argv[2];

main(options.dirname);

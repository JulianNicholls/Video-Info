const fs = require('fs');
const path = require('path');
const { ljust, rjust } = require('justify-text');

const { spawnFFProbe, parseData, humanSize, humanTime } = require('./videoData');
const { setOptions } = require('./options');

const options = {
  dirname: '',
  minsize: 0,
  maxsize: 0,
  minlength: 0,
  maxlength: 0,
  minheight: 0,
  maxheight: 0,
  sort: '',
  totals: false,
  brief: false,
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

        // Paradoxically, brief option means fully-qualified filename
        const name = options.brief ? fqfile : file.name;

        images.push({ name, duration, size, width, height });
      }
    }
  } catch (err) {
    console.error(`Cannot open ${dirname}`);
  }

  return images;
};

const filtered = (images, options) => {
  const {
    minsize,
    maxsize,
    minlength,
    maxlength,
    minheight,
    maxheight,
    sort,
  } = options;

  const fImages = images.filter(image => {
    // Probably not a video file
    if (image.height === 0 || image.duration === 0) return false;

    let ok = true;

    // These are easy, it doesn't matter whether they've been explicitly set
    // because 0 is a valid value
    if (
      image.size < minsize ||
      image.duration < minlength ||
      image.height < minheight
    )
      ok = false;

    if (maxsize !== 0 && image.size > maxsize) ok = false;
    if (maxlength !== 0 && image.duration > maxlength) ok = false;
    if (maxheight !== 0 && image.height > maxheight) ok = false;

    return ok;
  });

  if (sort) {
    fImages.sort((a, b) => a[sort] - b[sort]);
  }

  return fImages;
};

const main = dirname => {
  const images = readImages(dirname);
  const fImages = filtered(images, options);

  fImages.forEach(({ name, width, height, duration, size }) => {
    if (options.brief) console.log(name);
    else {
      const res = ljust(`${rjust(width.toString(), 4)}x${height}`, 9);
      const time = rjust(humanTime(duration), 7);

      console.log(
        `${ljust(name, 40)}  ${res}  ${time}  ${rjust(humanSize(size), 9)}`
      );
    }
  });

  if (!options.brief && options.totals && fImages.length > 1) {
    const { duration, size } = fImages.reduce(
      (acc, image) => {
        acc.duration += image.duration;
        acc.size += image.size;

        return acc;
      },
      { duration: 0, size: 0 }
    );

    console.log(`${rjust(humanTime(duration), 60)}  ${rjust(humanSize(size), 9)}`);
  }
};

setOptions(process.argv, options);

// console.log({ options });

// const dirname = process.argv[2];

main(options.dirname);

const { ffprobe } = require('fluent-ffmpeg');

const humanSize = size => {
  if (size > 1400000) return `${(size / 1048576).toFixed(1)}MB`;

  return `${(size / 1024).toFixed(2)}KB`;
};

const humanDuration = length => {
  length = Math.round(length);

  const hours = length > 3600 ? `${Math.floor(length / 3600)}:` : '';
  const mins = Math.floor((length % 3600) / 60);
  const secs = length % 60;

  if (hours === '' && mins === 0) return `${secs}s`;

  return `${hours}${mins < 10 ? '0' + mins : mins}:${
    secs < 10 ? '0' + secs : secs
  }`;
};

if (process.argv.length < 2) {
  console.error('You nust give a filename');
  process.exit(-1);
}

const filename = process.argv[2];

ffprobe(filename, (err, videodata) => {
  if (err) console.error(err);

  // console.log(videodata);

  const {
    format: { format_long_name: format, duration, size, bit_rate },
    streams,
  } = videodata;

  let video = null;

  for (const stream of streams) {
    if (stream.codec_type === 'video') {
      if (video) {
        console.warn('Multiple video streams');
      }

      video = stream;
    }
  }

  if (!video) {
    console.error('No video stream in file');
    process.exit(-2);
  }

  // console.log({ video });

  const { codec_name, width, height } = video;

  const resolution = `${codec_name} ${width}x${height}`;

  console.log(`
File:       ${filename}
Format:     ${format}
Resolution: ${resolution}
Length:     ${humanDuration(duration)}
Size:       ${humanSize(size)}
Bit Rate:   ${humanSize(bit_rate / 8)}/s
`);
});

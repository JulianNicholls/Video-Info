import ffmpeg from 'fluent-ffmpeg';

import { parseData, humanSize, humanTime } from './videoData.js';

if (process.argv.length < 2) {
  console.error('You nust give a filename');
  process.exit(-1);
}

const filename = process.argv[2];

ffmpeg.ffprobe(filename, (err, videodata) => {
  if (err) return console.error('An error occurred loading the video data for', filename);

  const { format, duration, size, bit_rate, codec_name, width, height } = parseData(videodata);

  const resolution = `${codec_name} ${width}x${height}`;

  console.log(`
File:       ${filename}
Format:     ${format}
Resolution: ${resolution}
Length:     ${humanTime(duration)}
Size:       ${humanSize(size)}
Bit Rate:   ${humanSize(bit_rate / 8)}/s
`);
});

const { spawnSync } = require('child_process');

const spawnFFProbe = filename => {
  const options = [
    '-v',
    '-8',
    '-of',
    'json=c=1',
    '-hide_banner',
    '-show_streams',
    '-show_format',
  ];

  const reply = spawnSync('ffprobe', [...options, filename], {
    encoding: 'utf-8',
  });

  return { data: JSON.parse(reply.stdout), ...reply };
};

const humanSize = size => {
  if (size > 1400000) return `${(size / 1048576).toFixed(1)}MB`;

  return `${(size / 1024).toFixed(2)}KB`;
};

const parseData = videodata => {
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

    return {
      format,
      duration: Number(duration),
      size: Number(size),
      bit_rate: Number(bit_rate),
      codec_name: '',
      width: 0,
      height: 0,
    };
  }

  const { codec_name, width, height } = video;

  return {
    format,
    duration: Number(duration),
    size: Number(size),
    bit_rate: Number(bit_rate),
    codec_name,
    width,
    height,
  };
};

const humanTime = length => {
  length = Math.round(length);

  const hours = length > 3600 ? `${Math.floor(length / 3600)}:` : '';
  const mins = Math.floor((length % 3600) / 60);
  const secs = length % 60;

  if (hours === '' && mins === 0) return `${secs}s`;

  return `${hours}${mins < 10 ? '0' + mins : mins}:${
    secs < 10 ? '0' + secs : secs
  }`;
};

module.exports = {
  spawnFFProbe,
  parseData,
  humanSize,
  humanTime,
};

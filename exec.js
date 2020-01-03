// execSync could be used, but it turns out that spawnSync is probably better anyway :-)
const { spawnSync } = require('child_process');

const options = [
  '-v',
  '-8',
  '-of',
  'json=c=1',
  '-hide_banner',
  '-show_streams',
  '-show_format',
];

const spawnFFProbe = filename => {
  const reply = spawnSync('ffprobe', [...options, filename], {
    encoding: 'utf-8',
  });

  return { data: JSON.parse(reply.stdout), ...reply };
};

const ffprobe = spawnFFProbe(process.argv[2]);

console.log(ffprobe.data);

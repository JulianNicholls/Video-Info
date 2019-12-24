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

console.log('Before');

const ffprobe = spawnFFProbe(process.argv[2]);

console.log('After');

console.log(ffprobe.data);

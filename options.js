const parseSize = value => {
  const [, numbers, suffix] = value.match(/([0-9]+)([mk]?)/i);
  let retval = Number(numbers);

  if (suffix.toLowerCase() === 'm') retval *= 1048576;
  else if (suffix.toLowerCase() === 'k') retval *= 1024;

  return retval;
};

const parseDuration = value => {
  const [, first, second, third] = value.match(/(\d{1,5}):?(\d{0,2}):?(\d{0,2})/);

  let retval = Number(first); // Just a value in seconds

  if (third) retval = Number(first) * 3600 + Number(second) * 60 + Number(third);
  else if (second) retval = Number(first) * 60 + Number(second);

  return retval;
};

// argv[0] = full path to node
// argv[1] = full path to this script
const setOptions = (argv, options) => {
  for (let i = 2; i < argv.length; ++i) {
    const arg = argv[i];

    if (arg[0] === '-') {
      const [, name, value] = arg.match(/-([a-z]+)[:=]([0-9mk:]+)/i);

      switch (name) {
        case 'minsize':
          options.minSize = parseSize(value);
          break;

        case 'maxsize':
          options.maxSize = parseSize(value);
          break;

        case 'minlength':
          options.minlength = parseDuration(value);
          break;

        case 'maxlength':
          options.maxlength = parseDuration(value);
          break;

        case 'minheight':
          options.minHeight = Number(value);
          break;

        case 'maxheight':
          options.maxHeight = Number(value);
          break;
      }
    } else options.dirname = arg;
  }
};

module.exports = { setOptions };

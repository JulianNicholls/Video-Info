const parseSize = (value) => {
  const [, numbers, suffix] = value.match(/([0-9]+)([mk]?)/i);
  let retval = Number(numbers);

  if (suffix.toLowerCase() === 'm') retval *= 1048576;
  else if (suffix.toLowerCase() === 'k') retval *= 1024;

  return retval;
};

const parseDuration = (value) => {
  const [, first, second, third] = value.match(/(\d{1,5}):?(\d{0,2}):?(\d{0,2})/);
  const firstNum = Number(first);
  const secondNum = Number(second);

  let retval = firstNum; // Just a value in seconds

  if (third) retval = firstNum * 3600 + secondNum * 60 + Number(third);
  else if (second) retval = firstNum * 60 + secondNum;

  return retval;
};

// argv[0] = full path to node
// argv[1] = full path to this script
const setOptions = (argv, options) => {
  for (let i = 2; i < argv.length; ++i) {
    const arg = argv[i];

    if (arg[0] === '-') {
      const [, name, value] = arg.match(/-([a-z]+)[:=]?([0-9mk:]+)?/i);

      switch (name) {
        case 'minsize':
        case 'maxsize':
          options[name] = parseSize(value);
          break;

        case 'minlength':
        case 'maxlength':
          options[name] = parseDuration(value);
          break;

        case 'minheight':
        case 'maxheight':
          options[name] = Number(value);
          break;

        case 'ss':
          options.sort = 'size';
          break;

        case 'sd':
          options.sort = 'duration';
          break;

        case 'totals':
        case 'brief':
          options[name] = true;
          break;
      }
    } else {
      options.dirname = arg;
    }
  }

  return !!options.dirname;
};

export { setOptions };

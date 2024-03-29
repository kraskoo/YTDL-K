const path = require('path');

function oppositeSeperatorPattern() {
  return path.sep === '/' ? /\\/g : /\//g;
}

function sanitizeDirectory(pathToSanitize) {
  let oppositePattern = oppositeSeperatorPattern();
  pathToSanitize = pathToSanitize.replace(oppositePattern, path.sep);
  if (!pathToSanitize.endsWith(path.sep)) {
    pathToSanitize = `${pathToSanitize}${path.sep}`;
  }

  return pathToSanitize;
}

function getOption(option) {
  switch (option.toLowerCase()) {
    case '-s':
    case '--skip':
      return 'skip';
    case '-u':
    case '--url':
      return 'url';
    case '-f':
    case '--format':
      return 'format';
    case '-l':
    case '--list':
      return 'list';
    case '-tn':
    case '--track-number':
      return 'trackNumber';
    case '-o':
    case '--output':
      return 'output';
    default: throw new SyntaxError(`Option ${option} doesn't exist!`);
  }
}

function getValueByOption(option, value) {
  switch (option) {
    case 'url': {
      if (!value.startsWith('https://www.youtube.com/')) {
        throw new SyntaxError('URL must be valid YouTube link!');
      }

      return value;
    }
    case 'format': {
      if (!['mp4', 'mp3', '0', '1'].includes(value)) {
        throw new SyntaxError('Format must be one of this options [mp4, mp3, 0, 1]!');
      }

      if (value === '0') {
        value = 'mp4';
      }

      if (value === '1') {
        value = 'mp3';
      }

      return value;
    }
    case 'list': {
      if (!['false', 'true', '0', '1'].includes(value)) {
        throw new SyntaxError('List must be one of this options [false, true, 0, 1]!');
      }

      if (value === 'false' || value === '0') {
        value = false;
      }

      if (value === 'true' || value === '1') {
        value = true;
      }

      return value;
    }
    case 'trackNumber': {
      if (value.match(/^[#№0-9a-zA-Z]{1,8}$/g) === null) {
        throw new SyntaxError(`Prefix must contains only numbers, latin alphabets, symbols: ['#', '№'] and must be in range [1.. 8]!`);
      }

      return value;
    }
    case 'skip': {
      value = parseInt(value);
      if (!Number.isInteger(value)) {
        throw new SyntaxError(`Skip option must be integer number`);
      }

      return value;
    }
    case 'output':
    default: return value;
  }
}

function parser(args) {
  let parsedObject = {};
  args.splice(0, 2);
  if (args.length % 2 !== 0) {
    throw new SyntaxError('Incorrect arguments length!');
  }

  for (let i = 0; i < args.length; i += 2) {
    let option = getOption(args[i]);
    let value = getValueByOption(option, args[i + 1]);
    parsedObject[option] = value;
  }
  
  if (!parsedObject.url) {
    throw new SyntaxError('URL parameter is required!');
  }

  if (!parsedObject.output) {
    parsedObject.output = './output';
  }

  parsedObject.output = sanitizeDirectory(parsedObject.output);
  if (!parsedObject.format) {
    parsedObject.format = 'mp4';
  }

  return parsedObject;
}

module.exports = parser;
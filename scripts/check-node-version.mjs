const requiredRanges = [
  { major: 20, minor: 19 },
  { major: 22, minor: 12 },
  { major: 24, minor: 0 },
];

function parseVersion(version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);

  if (!match) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function isSupportedNode(version) {
  if (version.major === 20) {
    return version.minor >= 19;
  }

  if (version.major === 22) {
    return version.minor >= 12;
  }

  return version.major >= 24;
}

const nodeVersion = parseVersion(process.version);

if (!nodeVersion || !isSupportedNode(nodeVersion)) {
  const npmVersion = process.env.npm_config_user_agent?.match(/npm\/([^\s]+)/)?.[1] ?? 'unknown';

  console.error(
    [
      `Unsupported Node.js version ${process.version}.`,
      'This project requires Node.js 20.19+, 22.12+, or 24+ for Angular CLI 21.',
      `Detected npm version: ${npmVersion}.`,
      'Please switch to a supported Node.js version before running the frontend.',
    ].join('\n'),
  );

  process.exit(1);
}

const COLORS = [
  '#0000CC',
  '#0000FF',
  '#0033CC',
  '#0033FF',
  '#0066CC',
  '#0066FF',
  '#0099CC',
  '#0099FF',
  '#00CC00',
  '#00CC33',
  '#00CC66',
  '#00CC99',
  '#00CCCC',
  '#00CCFF',
  '#3300CC',
  '#3300FF',
  '#3333CC',
  '#3333FF',
  '#3366CC',
  '#3366FF',
  '#3399CC',
  '#3399FF',
  '#33CC00',
  '#33CC33',
  '#33CC66',
  '#33CC99',
  '#33CCCC',
  '#33CCFF',
  '#6600CC',
  '#6600FF',
  '#6633CC',
  '#6633FF',
  '#66CC00',
  '#66CC33',
  '#9900CC',
  '#9900FF',
  '#9933CC',
  '#9933FF',
  '#99CC00',
  '#99CC33',
  '#CC0000',
  '#CC0033',
  '#CC0066',
  '#CC0099',
  '#CC00CC',
  '#CC00FF',
  '#CC3300',
  '#CC3333',
  '#CC3366',
  '#CC3399',
  '#CC33CC',
  '#CC33FF',
  '#CC6600',
  '#CC6633',
  '#CC9900',
  '#CC9933',
  '#CCCC00',
  '#CCCC33',
  '#FF0000',
  '#FF0033',
  '#FF0066',
  '#FF0099',
  '#FF00CC',
  '#FF00FF',
  '#FF3300',
  '#FF3333',
  '#FF3366',
  '#FF3399',
  '#FF33CC',
  '#FF33FF',
  '#FF6600',
  '#FF6633',
  '#FF9900',
  '#FF9933',
  '#FFCC00',
  '#FFCC33',
];

/** @type { Set<string> } */
export const namespaces = new Set();

/**
 * Factory for creating namespaced logging functions.
 * Namespaces are enabled via the `debug` localStorage key,
 * and support multiple comma/space separated namespaces with or without `*` wildcards.
 *
 * @param { string } namespace
 * @returns { (...data: Array<any>) => void }
 */
export default function debugFactory(namespace) {
  if (/\s/.test(namespace)) {
    throw Error('debug namespaces cannot include whitespace');
  }

  namespaces.add(namespace);

  if (!isEnabled(namespace)) {
    return function debug() {
      // no-op
    };
  }

  const color = selectColor(namespace);
  let lastCalled = 0;

  return function debug(...data) {
    const now = Date.now();
    const diff = now - (lastCalled || now);

    debugFactory.logFn(`%c${namespace} +${diff}ms`, `color: ${color}`, ...data);
    lastCalled = now;
  };
}

/**
 * Override log function.
 * Defaults to `console.log`
 */
debugFactory.logFn = console.log.bind(console);

/**
 * @param { string } namespace
 * @returns boolean
 */
export function isEnabled(namespace) {
  try {
    const patterns = (localStorage.getItem('debug') || '').split(/[\s,]+/g);

    for (const pattern of patterns) {
      if (pattern === '') {
        continue;
      }

      const wildcardIdx = pattern.indexOf('*');

      if (wildcardIdx > -1) {
        if (namespace.startsWith(pattern.slice(0, wildcardIdx))) {
          return true;
        }
      } else {
        if (namespace === pattern) {
          return true;
        }
      }
    }
  } catch (err) {
    // localStorage error
  }

  return false;
}

/**
 * @param { string } namespace
 * @returns { string }
 * @see https://github.com/debug-js/debug/blob/c0805cc4d3b2c7c987567e99ecaec78840516d7b/src/common.js#L41
 */
function selectColor(namespace) {
  let hash = 0;

  for (let i = 0; i < namespace.length; i++) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return COLORS[Math.abs(hash) % COLORS.length];
}

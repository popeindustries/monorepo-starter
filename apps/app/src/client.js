import './my-el.js';
import config from './config.js';
import Debug from '@popeindustries/debug';
import { render } from '@popeindustries/lit/html.js';
import { renderBodyContent } from './body.js';

const debug = Debug('app');
const dataElement = document.querySelector('#data');

if (dataElement !== null && dataElement.textContent !== null) {
  const data = JSON.parse(dataElement.textContent);

  render(renderBodyContent(config, data), document.body);

  debug('started!!');
} else {
  debug('serialised data not found!');
}

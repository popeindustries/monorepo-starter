import { html } from '@popeindustries/lit';

/**
 * @param { Config } config
 * @param { Data } data
 */
export function renderBodyContent(config, data) {
  return html`
    <h1>${config.title}</h1>
    <my-el ?enabled="${data.hasWidget}"></my-el>
    <p>${data.text}</p>
  `;
}

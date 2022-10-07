import '@popeindustries/lit/server-dom-shim.js';
import './my-el.js';
import { html, renderToNodeStream } from '@popeindustries/lit/html-server.js';
import config from './config.js';
import http from 'node:http';
import { hydratable } from '@popeindustries/lit/directives/hydratable.js';
import { renderBodyContent } from './body.js';

http
  .createServer((request, response) => {
    response.writeHead(200);
    // Returns a Node.js Readable stream which can be piped to "response"
    renderToNodeStream(Layout()).pipe(response);
  })
  .listen(8080);

function Layout() {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${config.title}</title>
        <script type="module" src="src/client.js"></script>
      </head>
      <body>
        ${renderBody()}
      </body>
    </html>
  `;
}

async function renderBody() {
  const data = await fetchRemoteData(config.endpoint);

  return html`
    <script id="data" type="application/json">
      ${JSON.stringify(data)}
    </script>
    ${hydratable(renderBodyContent(config, data))}
  `;
}

/**
 * @param { string } endpoint
 * @returns { Promise<Data> }
 */
async function fetchRemoteData(endpoint) {
  // Pretend to fetch data
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    hasWidget: true,
    text: 'Some really, really nice home text',
  };
}

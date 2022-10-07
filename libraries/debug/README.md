# @nrk/debug

Debug utility for namespaced logging, inspired by [debug.js](https://github.com/debug-js/debug). Namespaces are enabled via the `debug` localStorage key, and support multiple comma/space separated namespaces with or without `*` wildcards.

## Usage

```js
import Debug from '@nrk/debug';

const debug = Debug('app:widget');

localStorage.setItem('debug', 'app:*');

debug('enabled!');
```

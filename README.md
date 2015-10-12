# tilestrata-lru
[![NPM version](http://img.shields.io/npm/v/tilestrata-lru.svg?style=flat)](https://www.npmjs.org/package/tilestrata-lru)
[![Build Status](https://travis-ci.org/naturalatlas/tilestrata-lru.svg)](https://travis-ci.org/naturalatlas/tilestrata-lru)
[![Coverage Status](http://img.shields.io/codecov/c/github/naturalatlas/tilestrata-lru/master.svg?style=flat)](https://codecov.io/github/naturalatlas/tilestrata-lru)

A basic [TileStrata](https://github.com/naturalatlas/tilestrata) plugin for caching tiles to memory. Use cautiously – out of memory crashes are entirely possible if not configured carefully. If you want to share a single LRU across multiple layers and routes, that's just fine (the cache keys account for that).

```sh
$ npm install tilestrata-lru --save
```

### Sample Usage

```js
var lru = require('tilestrata-lru');

// set total size limit of cache
server.layer('mylayer').route('tile.pbf')
    .use(/* some provider */)
    .use(lru({size: '20mb' ttl: 30})); // ttl in seconds

// or set a total number of items
server.layer('mylayer').route('tile.pbf')
    .use(/* some provider */)
    .use(lru({size: 20, ttl: 30}));
```

## Contributing

Before submitting pull requests, please update the [tests](test) and make sure they all pass.

```sh
$ npm test
```

## License

Copyright &copy; 2015 [Natural Atlas, Inc.](https://github.com/naturalatlas) & [Contributors](https://github.com/naturalatlas/tilestrata-lru/graphs/contributors)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

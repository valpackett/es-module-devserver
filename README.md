[![npm version](https://img.shields.io/npm/v/es-module-devserver.svg?style=flat)](https://www.npmjs.org/package/es-module-devserver)
[![npm downloads](https://img.shields.io/npm/dm/es-module-devserver.svg?style=flat)](https://www.npmjs.org/package/es-module-devserver)
[![Unlicense](https://img.shields.io/badge/un-license-green.svg?style=flat)](https://unlicense.org)

# es-module-devserver

Simple static server middleware for express/[polka]/etc. that resolves npm style module imports in JavaScript files to make them available for the browser in development.
Just like [Polymer CLI / polyserve does](https://github.com/Polymer/tools/blob/e731b880a0d94a551f5781111f2f9c81cb64c642/packages/build/src/babel-plugin-bare-specifiers.ts).
But using regular expressions instead of dragging in a whole JS parser :D

[polka]: https://github.com/lukeed/polka

## Installation

Install with [npm], obviously:

```bash
npm install --save-dev es-module-devserver
```

[npm]: https://www.npmjs.com

## Usage

Something like this:

```javascript
const fs = require('fs')
const polka = require('polka')
const esModuleDevserver = require('es-module-devserver')

polka()
	.use(esModuleDevserver.middleware(__dirname))
	.get('/', (req, res) => {
		const content = fs.readFileSync('demo.html')
		return res.end(content)
	})
	.listen(3003)
	.then(_ => console.log('Running on localhost:3003'))
```

## Contributing

Please feel free to submit pull requests!

By participating in this project you agree to follow the [Contributor Code of Conduct](https://contributor-covenant.org/version/1/4/) and to release your contributions under the Unlicense.

[The list of contributors is available on GitHub](https://github.com/myfreeweb/es-module-devserver/graphs/contributors).

## License

This is free and unencumbered software released into the public domain.  
For more information, please refer to the `UNLICENSE` file or [unlicense.org](https://unlicense.org).

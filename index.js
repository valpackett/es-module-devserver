const fs = require('fs')
const path = require('path')
const mime = require('mime')
const resolve = require('resolve')

function resolvePath (root, filepath, url) {
	try {
		// ignore full urls
		new URL(url)
		return url
	} catch (e) {}
	try {
		return path.relative(path.dirname(filepath), resolve.sync(url, {
			basedir: root,
			packageFilter: (pkg) => {
				pkg.main = pkg.module || pkg['jsnext:main'] || pkg.main
				return pkg
			}
		}))
	} catch (e) {}
	return url
}

function transformJs (root, filepath, src) {
	return src
		.replace(/import\s+(|[\{\*\w][^"']*)["']([^"']+)["'][\t ]*($|;|\/\/|\/\*)/gm,
			(match, pre, url, post) => `import ${pre}'${resolvePath(root, filepath, url)}'${post}`)
		.replace(/export\s+([\{\*\w][^"']*)\s*from\s*["']([^"']+)["'][\t ]*($|;|\/\/|\/\*)/gm,
			(match, pre, url, post) => `export ${pre} from '${resolvePath(root, filepath, url)}'${post}`)
}


function middleware (root) {
	return function (req, res, next) {
		const reqpath = path.normalize(req.path).slice(1)
		if (reqpath.length < 1) {
			return next()
		}
		const filepath = path.resolve(root, reqpath)
		if (fs.existsSync(filepath)) {
			const filetype = mime.getType(filepath) || 'application/octet-stream'
			res.setHeader('Content-Type', filetype)
			if (filetype.startsWith('text/javascript') || filetype.startsWith('application/javascript')) {
				const content = fs.readFileSync(filepath, { encoding: 'utf-8' })
				return res.end(transformJs(root, filepath, content), { encoding: 'utf-8' })
			} else {
				const content = fs.readFileSync(filepath)
				return res.end(content)
			}
		}
		next()
	}
}

module.exports = { resolvePath, transformJs, middleware }

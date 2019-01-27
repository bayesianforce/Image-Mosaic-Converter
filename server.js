const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const util = require('util');
const config = require('./src/config.json');

const port = process.env.PORT || 3000;

const dir = path.dirname(fs.realpathSync(__filename));
const svgTemplate = [
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="%d" height="%d">',
    '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#%s"></ellipse>',
    '</svg>',
].join('');

http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    let m;
    if (pathname == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(dir + '/dist/index.html').pipe(res);
        return;
    } else if ((m = pathname.match(/^\/color\/([0-9a-fA-F]{6})/))) {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.write(util.format(svgTemplate, config.TILE_WIDTH, config.TILE_HEIGHT, m[1]));
        res.end();
        return;
    } else if ((m = pathname.match(/^\/js\//) || pathname.match(/^\//))) {
        const filename = dir + '/dist/' + pathname;
        const stats = fs.existsSync(filename) && fs.statSync(filename);
        if (stats && stats.isFile()) {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            fs.createReadStream(filename).pipe(res);
            return;
        }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found\n');
    res.end();
}).listen(port);

console.log('listening on port %d in %s mode', port);

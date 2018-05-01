var http = require("http"); // http server
var fs   = require("fs");   // file system access
var url  = require("url");  // url parser
var path = require("path"); // file path parser

// You can choose the port via command line, e.g. node server.js 3000
const port = process.argv[2] || '1234';
const folderToServe = 'app';
const mimeTypes = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ttf': 'aplication/font-sfnt'
};
// Each triplet is a URL prefix, a folder to serve, and the default
// filename to use when a folder is resolved. Longest prefixes first!
const routes = [['/node_modules/', 'node_modules', 'index.js'],
                ['/', 'app', 'index.html']];

http.createServer(function (request, response) {
  console.log(`${request.method} ${request.url}`);
  
  let parsedUrl = url.parse(request.url);
  // Figure out which of the routes applies to the requested URL
  let route = routes.filter(r => r[0] == parsedUrl.pathname.substr(0, r[0].length))[0];
  // Figure out the path of the file in the real file system
  let filePath = route[1] + '/' + parsedUrl.pathname.substr(route[0].length);

  // Check whether the file exists and whether it is actually a folder
  fs.stat(filePath, (err, fileInfo) => {
    if (err) {
      response.statusCode = 404;
      response.end("Error: " + err.message);
    } else {
      if (fileInfo.isDirectory())
        filePath += '/' + route[2];
      
      // Read the file and send it to the user's web browser
      fs.readFile(filePath, (err, data) => {
        if (err) {
          response.statusCode = 404;
          response.end("Read error: " + err.message);
        } else {
          let ext = path.extname(filePath);
          let mimeType = mimeTypes[ext] || 'application/octet-stream';
          response.writeHead(200, {'Content-Type': mimeType});
          response.end(data);
        }
      });
    }
  });
}).listen(parseInt(port));
  
console.log(`Server running: http://127.0.0.1:${port}`);

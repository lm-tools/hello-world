const http = require('http');

const port = process.env.PORT || 3001;
process.env = process.env || 'TEST';
http.createServer(require('./app/app'))
    .listen(port);

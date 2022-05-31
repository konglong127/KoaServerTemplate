const path = require('path');
const config = require(path.resolve(__dirname, './config/config')).server;
const http = require(path.resolve(__dirname, './http/http'));

if (config.type == 'http') {
  http.create(config.workers[0] || { port: 80, role: 'worker' }, false);
} else if (config.type == 'http2') {
  
} else {
  http.create(config.workers[0] || { port: 443, role: 'worker' }, false);
}
const path = require('path');
const config = require(path.resolve(__dirname, '../config')).server;
const http = require(path.resolve(__dirname, './http'));

if (config.type == 'https') {
  http.create(config.workers[0] || { port: 443, role: 'worker' }, false);
}else {
  http.create(config.workers[0] || { port: 80, role: 'worker' }, false);
}
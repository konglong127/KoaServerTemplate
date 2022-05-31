const path = require('path');
const moment = require('moment');
const log = require(path.resolve(__dirname, '../../log/log'));
const jwt = require(path.resolve(__dirname, '../token/token'));
const config = require(path.resolve(__dirname, '../../config/config.js'));
const mysql = require(path.resolve(__dirname, '../database/mysql'));
// const redis=require(path.resolve(__dirname,'../database/redis'));

module.exports = () => {
    return async function (ctx, next) {
        ctx.log = log;
        ctx.jwt = jwt;
        ctx.config = config;
        ctx.moment = moment;
        ctx.mysql = mysql;
        // ctx.redis=redis;
        await next();
    }
}
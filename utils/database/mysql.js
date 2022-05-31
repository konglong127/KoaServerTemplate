const MySQL = require('mysql');
const path = require('path');
const log = require(path.resolve(__dirname, '../../log/log'));
const { mysql, server } = require(path.resolve(__dirname, '../../config/config'));
var arr = [];

var connection;

function reconnnectProcessing() {
    if (arr.length == 10) {
        arr = arr.slice(1, 10);
    }
    arr.push(new Date().getTime());
    if (arr.length == 10 && arr[9] - arr[0] < 10000) {
        if (server.environment == 'development')
            console.log('数据库连接失败！请检查账号密码是否正确!');
        return true;
    }
    return false;
}

function keepConnection() {
    connection = MySQL.createConnection({
        host: mysql.host,
        user: mysql.user,
        password: mysql.password,
        database: mysql.database
    });

    connection.connect(() => {
        if (server.environment == 'development')
            console.log('mysql database connected')
    });

    connection.on('error', () => {
        if (reconnnectProcessing())
            return;
        if (server.environment == 'development')
            console.log('mysql database connection error')
        keepConnection();
    });

    connection.on('end', () => {
        if (reconnnectProcessing())
            return;
        if (server.environment == 'development')
            console.log('mysql database connection end');
        keepConnection();
    });
};

keepConnection();

setInterval(() => {
    connection.ping((err, data) => {
        if (server.environment == 'development')
            console.log(err, data);
    });
    connection.query("select 'keep connection'", (err, data) => {
        if (server.environment == 'development')
            console.log(err, data);
    });
}, 3600000);

/**
 * @select object
 * @where object
 * @innerJoin object
 * @delete object
 * @update object
 * @union {}
 * @group object
 * @order object
 * @limit object
 * @query object
 */

function DataBaseQuery() {
    this.sql = '';
    this.select = function (options) {
        let { table, params, success, fail, over, exists } = options;
        if (!table)
            return '表名不存在！';
        this.sql += 'select ';
        if (params && params.length != 0) {
            this.sql += connection.escape(params);
            this.sql = this.sql.replace(/'/g, "");
        } else {
            this.sql += '*';
        }
        this.sql += ` from ${table} `;
        if (exists == 'end') {
            this.sql += ')';
        }
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        log(`查询时间：${new Date()}\n查询语句：${this.sql}${over ? '' : '??????'}\n\n`, 'query');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    this.innerJoin = function (options) {
        let { table, on, over, success, fail, exists } = options;
        if (!table || !on)
            return '缺少参数！';
        this.sql += ` inner join ${table} on `;
        for (let i in on) {
            this.sql += ` ${on[i]} and `;
        }
        this.sql = this.sql.slice(0, this.sql.length - 4);
        if (exists == 'end') {
            this.sql += ')';
        }
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        log(`查询时间：${new Date()}\n查询语句：${this.sql}${over ? '' : '??????'}\n\n`, 'query');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    // data支持数组和对象
    this.insert = function (options) {
        let { data, table, success, fail } = options;
        if (!data || !table)
            return '缺少参数！';
        this.sql = `insert into ${table}`;
        if (!data.length) {
            this.sql += ' (';
            for (let i in data) {
                this.sql += `${i},`;
            }
            this.sql = this.sql.slice(0, this.sql.length - 1);
            this.sql += ') values (';
            for (let j in data) {
                if (typeof data[j] == 'string') {
                    data[j] = data[j].toString().replace(/[']/g, '"');
                    data[j] = data[j].toString().replace(/#|--/g, '');
                }
                this.sql += `'${data[j]}',`;
            }
            this.sql = this.sql.slice(0, this.sql.length - 1);
            this.sql += ')';
        } else if (data.length) {
            this.sql += ` values (${connection.escape(data)})`;
        } else {
            return '数据类型不符合条件！';
        }
        let sql = this.sql;
        this.sql = '';
        if (server.environment == 'development')
            console.log(this.sql);
        log(`查询时间：${new Date()}\n查询语句：${this.sql}\n\n`, 'query');
        if (success) {
            connection.query(sql, (err, data) => {
                !err ? success(data) : fail ? fail(err) : success(err);
            });
        } else {
            return new Promise((resolve, reject) => {
                connection.query(sql, (err, data) => {
                    !err ? resolve(data) : reject(false);
                });
            });
        }
    }
    this.delete = function (table) {
        if (!table)
            return '缺少要删除的表名！';
        this.sql = `delete from ${table}`;
        return this;
    }
    this.update = function (options) {
        let { table, params } = options;
        if (!table || !params)
            return '缺少参数！';
        this.sql = `update ${table} set `;
        // this.sql+=connection.escape(params);
        for (let i in params) {
            this.sql += `${i} = '${params[i]}',`;
        }
        this.sql = this.sql.slice(0, this.sql.length - 1);
        return this;
    }
    this.where = function (options) {
        let { params, over, success, fail, exists } = options;
        if (!params)
            return '缺少参数！';
        this.sql += ' where ';
        if (params == 'exists') {
            this.sql += ' exists (';
        } else if (params == 'notExists') {
            this.sql += ' not exists (';
        } else if (params.in) {
            for (let i in params.arr) {
                this.sql += ` ${params.arr[i]} and `;
            }
            this.sql += ` ${params.in} in (`;
        } else {
            for (let i in params) {
                if (params[i] && params[i].toString().startsWith('like') || params[i] && params[i].toString().startsWith('regexp')) {
                    this.sql += `${i} ${params[i]} and `;
                } else {
                    if (!/http/g.test(params[i]) && /\./g.test(connection.escape(params[i]))) {
                        this.sql += `${i}=${connection.escape(params[i]).replace(/\'/g, '')} and `;
                    } else {
                        this.sql += `${i}=${connection.escape(params[i])} and `;
                    }
                }
            }
            this.sql = this.sql.slice(0, this.sql.length - 5);
        }
        if (exists == 'end') {
            this.sql += ')';
        }
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        log(`查询时间：${new Date()}\n查询语句：${this.sql}${over ? '' : '??????'}\n\n`, 'query');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    this.union = function () {
        this.sql += ' union ';
        return this;
    }
    this.group = function (options) {
        let { params, over, success, fail, exists } = options;
        if (!params || !params.length)
            return '缺少参数!';
        this.sql += ` group by ${params} `;
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        log(`查询时间：${new Date()}\n查询语句：${this.sql}${over ? '' : '??????'}\n\n`, 'query');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    this.order = function (options) {
        let { params, over, success, fail, exists } = options;
        if (!params || !params.length)
            return '缺少参数!';
        this.sql += ' order by ';
        for (let i in params) {
            this.sql += `${connection.escape(params[i].name).replace(/'/g, '')} ${connection.escape(params[i].method).replace(/'/g, '')},`;
            // this.sql=this.sql.replace(/'/g,'');
        }
        this.sql = this.sql.slice(0, this.sql.length - 1);
        if (exists == 'end') {
            this.sql += ')';
        }
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        log(`查询时间：${new Date()}\n查询语句：${this.sql}${over ? '' : '??????'}\n\n`, 'query');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    this.having = function (options) {
        let { params, over, success, fail } = options;
        if (!params)
            return '缺少参数';

        this.sql += ` having ${Object.getOwnPropertyNames(params)} ${params[Object.getOwnPropertyNames(params)]} `;
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    this.limit = function (options) {
        let { start, size, over, success, fail, exists } = options;
        if (isNaN(start) || isNaN(size))
            return '参数错误！';
        this.sql += ` limit ${start},${size}`;
        if (exists == 'end') {
            this.sql += ')';
        }
        if (server.environment == 'development')
            console.log(this.sql, over ? '' : '??????');
        log(`查询时间：${new Date()}\n查询语句：${this.sql}${over ? '' : '??????'}\n\n`, 'query');
        if (over) {
            let sql = this.sql;
            this.sql = '';
            if (success) {
                connection.query(sql, (err, data) => {
                    !err ? success(data) : fail ? fail(err) : success(err);
                });
            } else {
                return new Promise((resolve, reject) => {
                    connection.query(sql, (err, data) => {
                        !err ? resolve(data) : reject(false);
                    });
                });
            }
        } else {
            return this;
        }
    }
    this.query = function (options) {
        let { sql, success, fail } = options;
        if (typeof sql != 'string' || sql.trim().length == 0)
            return '传入参数必须为字符';
        if (success) {
            connection.query(sql, (err, data) => {
                !err ? success(data) : fail ? fail(err) : success(err);
            });
        } else {
            return new Promise((resolve, reject) => {
                connection.query(sql, (err, data) => {
                    !err ? resolve(data) : reject(false);
                });
            });
        }
    }
    this.reConnection = function () {
        connection.end(() => {
            if (server.environment == 'development')
                console.log('close');
        })
    }
}

module.exports = new DataBaseQuery();

// npm start 启动服务器
// npm run serve 单独启动
const path = require('path');

module.exports = {
    // wx: [
    //     {
    //         name: '',
    //         appid: '',
    //         secret: ''
    //     }
    // ],

    // http配置
    server: {
        //服务器类型 http、https、http2
        type: 'http',
        // type: 'https',
        keyPath: path.resolve(__dirname, '../utils/keys/private.pem'),
        certPath: path.resolve(__dirname, '../utils/keys/file.crt'),
        // 代理，通过socket实现进程间通信
        // agent:81,
        //进程监听的端口号
        workers: [
            { port: 82, role: 'worker' },
            { port: 83, role: 'worker' },
            { port: 84, role: 'worker' },
            { port: 85, role: 'agent' }
        ],
        //页面模板类型 html、ejs
        template: 'html',
        environment: 'development',
        //启动提示
        desc: '服务器已启动',
        //文件上传路径
        uploadPath: '../public/upload',
        // 开启服务器上的socket连接
        webSocket: true,
        // 服务器间socket连接
        serverSocket: true
    },

    // mysql数据配置
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'test'
    },

    // redis配置，可以全部省略
    redis: {
        port: 6379,
        host: '127.0.0.1',
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        password: '',
        db: 4            //连接数据库的数量
    },

    // 中间件配置
    middlewares: ['validateToken'],

    // 定义通过中间的接口
    passMiddlewares: [  ],

    //哪个接口能上传文件
    uploadUrl: [
        '/uploadFile'
    ],

    // 是否输出日志记录情况
    logConsole: false
}
# 1、main.js

进程管理文件，配置启动进程数，开启几个http服务器，开启几个https服务器。

### 1.启动方式

| npm start     | 启动所有服务器      |
| ------------- | ------------------- |
| npm run serve | 启动一个服务器  |

※修改config.js文件配置，添加router.js列表，接口在controller文件中，用到中间件在middlewares文件夹中。

# 2、router

router文件夹存放http和https的url列表，分别在httpRouter.js和httpsRouter.js中。

### 1.添加url

router.请求方式('请求路径',async (ctx)=>controller.文件名.文件中函数名(ctx))

module.exports = (router) => {

​	return async (ctx, next) => {

​		let { controller }=ctx;

​		router

​			.get('/', async (ctx) => controller.home.index(ctx))

​			.post('/login', async (ctx) => controller.login.login(ctx))

​			.putchar('/getlist', async (ctx) => controller.getlist.index(ctx))

​			.delete('/delList', async (ctx) => controller.getlist.delList(ctx));

​		await next();

​	}

}

# 3.controller

存放请求处理接口文件，接口文件中可以方1到n个接口

建议：

​	1）一个文件接口函数不要超过5个

​	2）接口文件为页面名

​	3）函数名为请求路径名

# 4.views

存放页面，用文件夹分组存放（路径开始在viewsxia）

页面引入方法在ctx.render中

ctx.render(‘index/index.html’,{});

# 5.public

存放图片等静态资源（路径开在public文件xia）

# 6.log

日志处理，存放日志

# 7.config

服务配置文件，配置在config.js中

wx:[

​    {

​      name:'小程序名',

​      appid:'',

​      secret:''

​    }

  ]

http:{

​	worker :2,//http进程数

​	port:82,//端口

​	url:'http://127.0.0.1',

​	http:'http://127.0.0.1:82'

}

db:{

​    host:'localhost',

​    user:'root',

​    password:'root',

​    database:'test'

  }

plugin.js中可以添加一些插件，可以避免在接口中重复引入

# 8.middlewares

添加中间件，要在http文件中的http.js和https.js中引入（不用关心文件名）

module.exports=(options)=>{

​	 	let {type}=options;

​		return async function(ctx,next){

​			if(type=='http'){//只在https服务器执行该中间件

​				return await next();

​			}

​			/*

​				.........

​			*/

​			console.log('只在https中执行的中间件，中间件middlewares/m1.js');

​			await next();

​		}

}




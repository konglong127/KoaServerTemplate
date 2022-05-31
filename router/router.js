module.exports = (router) => {
    return async function (ctx, next) {
        let { controller } = ctx;
        
        // .请求方式('请求路径',async (ctx)=>controller.文件名.文件中函数名(ctx))
        // 存放接口文件名建议和页面名相同  home.html home.js
        // 文件中函数名建议和请求路径名相同 /login=login
        
        // router
        // .get('/',async (ctx)=>await controller.home.index(ctx))
        // .get('/login',async (ctx)=>await controller.login.login(ctx))
        // .get('/getlist',async (ctx)=>await controller.home.getlist(ctx))
        // .get('/page',async (ctx)=>await controller.page.index(ctx))
        // .get('/redisDesc',async (ctx)=>await controller.page.redisDesc(ctx))
        router
            .get('/',controller.indexPage)
            .get('/getMsg',controller.getMsg)

        await next();
    }
}
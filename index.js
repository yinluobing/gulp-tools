// 引用
let Koa = require('koa'),
    Router = require('koa-router'),
    static = require('koa-static'),
    fs = require('fs');

// 实例化
let app = new Koa(),
    router = new Router();

// 控制器
let controller = {
    index: (ctx, next) => {
        ctx.type = 'html'
        ctx.response.body = fs.createReadStream('./index.html')
    }
}

// 路由
router.get('/', controller.index);


app.use(router.routes())
app.use(static('.'))
app.listen(3000)

// module.exports = {
//   async indexPage(ctx) {
//     let { render } = ctx;
//     await render('index/index.html', {});
//   },
//   async getMsg(ctx){
//     let {mysql,moment,log,request,response}=ctx;
//     response.body=moment().format('YYYY-MM-DD hh:mm:ss');
//   }
// }

// function index(){
//   this.indexPage=async function(ctx) {
//     let { render } = ctx;
//     await render('index/index.html', {});
//   }
//   this.getMsg=async function(ctx){
//     let {mysql,moment,log,request,response}=ctx;
//     response.body=moment().format('YYYY-MM-DD hh:mm:ss');
//   }
// };

class index {
  async indexPage(ctx) {
    let { render } = ctx;
    await render('index/index.html', {});
  }
  async getMsg(ctx) {
    let { mysql, moment, log, request, response } = ctx;
    response.body = moment().format('YYYY-MM-DD hh:mm:ss');
  }
};

module.exports = index;
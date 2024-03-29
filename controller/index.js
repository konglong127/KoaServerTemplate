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
  async getData(ctx) {
    let { request, response } = ctx;
    console.log(request.body);
    response.body='ok'
  }
};

module.exports = index;
const fs=require('fs');
const path=require('path');

function Controller(){}

module.exports=()=>{
  return async function(ctx,next){
    
    let dir=fs.readdirSync(path.resolve(__dirname,`../../controller`));
    for(let i in dir){

      let index=dir[i].lastIndexOf('.js');
      dir[i]=dir[i].slice(0,index);

      let fun=require(path.resolve(__dirname,`../../controller/${dir[i]}`));
      Controller.prototype=new fun();
      Controller.prototype.constructor=Controller;
    }
    ctx.controller=new Controller();
    await next();
  }
}
const path=require('path');
const fs=require('fs');
const config=require('../../config');

module.exports=()=>{
  let mws=config.middlewares;
  let obj={};
  let exists=fs.existsSync(path.resolve(__dirname,'../../middlewares'));
  if(exists){
    if(mws){
      for(let i in mws){
        obj[i]=require(path.resolve(__dirname,`../../middlewares/${mws[i]}`));
      }
    }
  }
  return obj;
}
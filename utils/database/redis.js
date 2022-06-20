const path=require('path');
const config=require(path.resolve(__dirname,'../../config')).redis;
const Redis=require('ioredis');
const redis=new Redis(config.redis||{});



module.exports=redis;
// class Redis{
//   constructor(){
//     this.redis=require('ioredis');
//     this.client;
//   }
//   connection(options){
//     try{
//       this.client=new this.redis(options||{});
//       console.log('连接成功！');
//     }catch{
//       console.log('连接失败！');
//     }
//   }
//   set(key,value,passTime){
//     if(passTime){
//       console.log('passTime');
//       return this.client.set(key,value,'EX',passTime);
//     }else{
//       return this.client.set(key,value);
//     }
//   }
//   get(key,callback){
//     return this.client.get(key,(err,data)=>{
//       callback(err,data);
//     });
//   }
//   del(key){
//     return this.client.del(key);
//   }
//   sadd(key,value){
//     return this.client.sadd(key,value);
//   }
//   smembers(key,callback){
//     return this.client.smembers(key,(err,data)=>{
//       callback(err,data);
//     });
//   }
//   srem(key,member){
//     return this.client.srem(key,member);
//   }
//   pipeline(){
//     return this.client.pipeline();
//   }
//   multi(){
//     return this.client.multi();
//   }
// }
// const re=new Redis();
// re.connection();
// re.set('name','andy');
// re.get('name',(err,data)=>{
//   console.log(data);
// });
// re.del('name');
// // re.sadd('list',1,2,3,4,5,6,7,8); //用数组吧，我给又套了一层，没加那么多方式
// // re.srem('list',[1,2,3,4,5,6,7,8]);
// // re.del('list');
// re.sadd('list',[1,2,3,4,5,6,7,8,9,10]);
// re.smembers('list',(err,data)=>{
//   console.log(data);
// });
// re.set('age',34,10);
// setTimeout(()=>{
//   re.get('age',(err,data)=>{
//     console.log('data====',data);
//   });
// },1000);

// re.pipeline()
// .set('foo','o(╥﹏╥)o')
// .del('list:4')
// .exec().then((res)=>{
//   console.log(res);
// });

// re.multi()
// .set('statue','o(╥﹏╥)o')
// .set('Hello','world')
// .exec((err,res)=>{
//   console.log(res);
// });
class Cluster{
    constructor(){
        this.path=require('path');
        this.cluster=require('cluster');
        this.serverConfig=require(this.path.resolve(__dirname,'../config/config')).server;
        this.log=require(this.path.resolve(__dirname,'../log/log'));
        this.totalWorkers=0;
        this.workers=[];
        this.restart=[];
    }
    createProcess(){
        let {cluster,serverConfig,totalWorkers,log,workers}=this;
        totalWorkers=serverConfig.workers.length;

        if(cluster.isMaster){
            for(let i=0;i<serverConfig.workers.length;i++){
                workers.push(cluster.fork());
                workers[i].info=serverConfig.workers[i];
                workers[i].send({
                    pid:workers[i].process.pid,
                    info:serverConfig.workers[i]
                }); 
            }

            if(totalWorkers==0){
                console.log('no server start!');
            }

            if(this.serverConfig.environment=='development'){
                console.log('development environment');
                cluster.on('fork',(worker) => {
                    console.log('进程',worker.process.pid,'被创建','进程数:',workers.length,workers.length==totalWorkers);
                });
            }
                
            Object.keys(cluster.workers).forEach((index)=>{
                cluster.workers[index].on('message',(pid)=>{
                    process.kill(pid);
                    let index=workers.findIndex(worker=>worker.process.pid==pid);
                    workers.splice(index,1);
                });
            });

            cluster.on('exit',(worker,code,signal)=>{
                let index=workers.findIndex(item=>item.process.pid==worker.process.pid);
                if(index>=0){
                    try{
                        workers.splice(index,1);
                    }catch{
                        if(this.serverConfig.environment=='development')
                        console.log('进程已退出！');
                    }
                }

                if(workers.length<totalWorkers){
                    this.clusterRestart(worker);
                    if(this.serverConfig.environment=='development')
                    console.log('restart');
                }

                if(this.serverConfig.environment=='development')
                console.log(`进程数：${workers.length}`);
            });

        }else{
            var pid;
            process.on('message',(data)=>{
                pid=data.pid;
                let http=require(this.path.resolve(__dirname,'./http'));
                http.create(data.info,true);
            });

            if(this.serverConfig.environment!='development')
            process.on('uncaughtException',(err)=>{
                log(`
                --------------------------------------------------------------------------\n
                    出错时间：${new Date()}\n
                    文件名: main.js\n
                    错误描述：有未捕获错误！导致进程重启！\n
                    有进程出错，退出\n
                    错误信息：${JSON.stringify(err)}\n
                --------------------------------------------------------------------------\n
                `);
                process.send(pid);
            });
        }
    }
    clusterRestart(worker){
        let {cluster,workers,restart}=this;
        if(this.serverConfig.environment=='development')
        console.log('进程 '+worker.process.pid+' 退出了');
        restart.push(new Date().getTime());

        if(restart.length>20){
            restart=restart.slice(restart.length-20,restart.length);
        }

        if(this.serverConfig.environment=='development')
        console.log(restart,restart.length,restart[restart.length-1]-restart[0]);

        if(restart.length>=20&&restart[restart.length-1]-restart[0]<=15000){
            if(this.serverConfig.environment=='development')
            console.log('seriously error!');
            process.exit();
        }

        workers.push(cluster.fork());

        workers[workers.length-1].info=worker.info;
        workers[workers.length-1].send({
            pid:workers[workers.length-1].process.pid,
            info:worker.info
        });

    }
}

new Cluster().createProcess();

// No shell, configuration file, launch daemon, sudo, firewall or system DNS changes.
const {spawn}=require('node:child_process');let child,ending=false;
function stop(){if(ending)return;ending=true;if(!child)return process.exit(0);child.kill('SIGTERM');setTimeout(()=>{child?.kill('SIGKILL');process.exit(0);},1500).unref();}
process.on('disconnect',stop);process.on('SIGTERM',stop);process.on('SIGINT',stop);
process.on('message',message=>{if(message?.stop)return stop();if(child||ending)return;
 child=spawn(message.executable,message.args,{stdio:'ignore',shell:false});
 child.once('error',()=>{if(process.connected)process.send({error:true});process.exit(1);});
 child.once('exit',()=>process.exit(ending?0:1));
});

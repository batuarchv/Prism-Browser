function createTabSelection(){
 const order=new Map();let sequence=0;
 return {select(id){order.set(id,++sequence);},remove(id){order.delete(id);},previous(tabs){return tabs.reduce((best,t)=>!best||(order.get(t.id)||0)>(order.get(best.id)||0)?t:best,null);}};
}
module.exports={createTabSelection};

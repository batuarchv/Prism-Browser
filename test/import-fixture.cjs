// Synthetic browser data for the import tests (0.42): Chrome with two profiles, Arc and Safari, all in a temporary home.
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');const {DatabaseSync}=require('node:sqlite');
// Safari Bookmarks.plist (binary) with Favorites, a nested folder, the menu, Reading List and a non-web link.
const SAFARI_PLIST='YnBsaXN0MDDTAQIDBDEZWENoaWxkcmVuVVRpdGxlXxAPV2ViQm9va21hcmtUeXBlpAUIGybSAgMGB1dIaXN0b3J5XxAUV2ViQm9va21hcmtUeXBlUHJveHnTAQIDCRoZogoS0wsMAw0QEV1VUklEaWN0aW9uYXJ5WVVSTFN0cmluZ9EOD1V0aXRsZVdFeGFtcGxlXxAUaHR0cHM6Ly9leGFtcGxlLmNvbS9fEBNXZWJCb29rbWFya1R5cGVMZWFm0wECAxMYGaEU0wsMAxUXEdEOFmcAxwBhAGwBMQFfAG0AYV8QFWh0dHBzOi8vZXhhbXBsZS5vcmcvYWoAUAByAG8AagBlAGsAdABlACAnKF8QE1dlYkJvb2ttYXJrVHlwZUxpc3RcQm9va21hcmtzQmFy0wECAxwlGaIdIdMLDAMeIBHRDh9TYmFkXxATamF2YXNjcmlwdDphbGVydCgxKdMLDAMiJBHRDiNUTWVudV8QFWh0dHBzOi8vbWVudS5leGFtcGxlL11Cb29rbWFya3NNZW510wECAycwGaEo1CkLDAMqLS8RW1JlYWRpbmdMaXN00SssWURhdGVBZGRlZDNBx4L4QAAAANEOLlVMYXRlcl8QFWh0dHBzOi8vcmVhZC5leGFtcGxlL18QFWNvbS5hcHBsZS5SZWFkaW5nTGlzdFAACAAPABgAHgAwADUAOgBCAFkAYABjAGoAeACCAIUAiwCTAKoAwADHAMkA0ADTAOIA+gEPASUBMgE5ATwBQwFGAUoBYAFnAWoBbwGHAZUBnAGeAacBswG2AcAByQHMAdIB6gICAAAAAAAAAgEAAAAAAAAAMgAAAAAAAAAAAAAAAAAAAgM=';
const toChrome=ms=>String((BigInt(ms)+11644473600000n)*1000n);
function encrypt(key,text){const c=crypto.createCipheriv('aes-128-cbc',key,Buffer.alloc(16,32));return Buffer.concat([Buffer.from('v10'),c.update(text),c.final()]);}
function chromiumProfile(dir,key,now){
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'Bookmarks'),JSON.stringify({roots:{bookmark_bar:{type:'folder',name:'Bookmarks bar',children:[{type:'url',name:'News',url:'https://news.example/'}]},other:{type:'folder',name:'Other',children:[{type:'url',name:'Files',url:'file:///etc/hosts'}]}}}));
 let db=new DatabaseSync(path.join(dir,'History'));db.exec('CREATE TABLE urls(id INTEGER PRIMARY KEY,url TEXT,title TEXT,last_visit_time INTEGER,hidden INTEGER DEFAULT 0)');
 const add=db.prepare('INSERT INTO urls(url,title,last_visit_time,hidden) VALUES(?,?,?,?)');add.run('https://news.example/',' News',toChrome(now-1000),0);add.run('https://old.example/','Old',toChrome(now-86400000),0);add.run('chrome://settings','Settings',toChrome(now),0);add.run('https://hidden.example/','Hidden',toChrome(now),1);db.close();
 db=new DatabaseSync(path.join(dir,'Login Data'));db.exec('CREATE TABLE logins(origin_url TEXT,username_value TEXT,password_value BLOB,blacklisted_by_user INTEGER)');
 const login=db.prepare('INSERT INTO logins VALUES(?,?,?,?)');login.run('https://mail.example/login','ada',encrypt(key,'test-only-1'),0);login.run('http://plain.example/','bob',encrypt(key,'test-only-2'),0);login.run('https://never.example/','',Buffer.alloc(0),1);login.run('https://broken.example/','eve',Buffer.from('v11xxxx'),0);db.close();
}
function fixture(){
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'prism-migrate-test-'));const key=crypto.randomBytes(16);const now=Date.now();
 const chrome=path.join(home,'Library/Application Support/Google/Chrome');chromiumProfile(path.join(chrome,'Default'),key,now);chromiumProfile(path.join(chrome,'Profile 2'),key,now);fs.mkdirSync(path.join(chrome,'Crashpad'));
 fs.writeFileSync(path.join(chrome,'Local State'),JSON.stringify({profile:{info_cache:{Default:{name:'Personal'},'Profile 2':{name:'Work'}}}}));
 const arc=path.join(home,'Library/Application Support/Arc');chromiumProfile(path.join(arc,'User Data/Default'),key,now);fs.rmSync(path.join(arc,'User Data/Default/Bookmarks'));
 fs.writeFileSync(path.join(arc,'StorableSidebar.json'),JSON.stringify({sidebar:{containers:[{items:['fav',{id:'fav',data:{tab:{savedURL:'https://arc.example/',savedTitle:'Arc fav'}}}],topAppsContainerIDs:[{default:true},'fav']}]}}));
 const safari=path.join(home,'Library/Safari');fs.mkdirSync(safari,{recursive:true});fs.writeFileSync(path.join(safari,'Bookmarks.plist'),Buffer.from(SAFARI_PLIST,'base64'));
 const db=new DatabaseSync(path.join(safari,'History.db'));db.exec('CREATE TABLE history_items(id INTEGER PRIMARY KEY,url TEXT);CREATE TABLE history_visits(id INTEGER PRIMARY KEY,history_item INTEGER,visit_time REAL,title TEXT)');
 db.exec("INSERT INTO history_items VALUES(1,'https://safari.example/'),(2,'ftp://files.example/')");const v=db.prepare('INSERT INTO history_visits(history_item,visit_time,title) VALUES(?,?,?)');v.run(1,(now-5000)/1000-978307200,'First');v.run(1,(now-2000)/1000-978307200,'Latest');v.run(2,(now-1000)/1000-978307200,'FTP');db.close();
 return {home,key,now};
}
module.exports={fixture};

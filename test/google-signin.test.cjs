const {test}=require('node:test');const assert=require('node:assert/strict');const crypto=require('node:crypto');
const {isRejected,isGoogleHost,signedIn,toCookies}=require('../src/google-signin.cjs');
const key=crypto.pbkdf2Sync('secret','saltysalt',1003,16,'sha1');
const enc=(value,host)=>{const plain=Buffer.concat([host?crypto.createHash('sha256').update(host).digest():Buffer.alloc(0),Buffer.from(value)]);const c=crypto.createCipheriv('aes-128-cbc',key,Buffer.alloc(16,32));return Buffer.concat([Buffer.from('v10'),c.update(plain),c.final()]);};
const chrome=s=>String(Math.round((s+11644473600)*1e6));const later=Date.now()/1000+86400;
test('spots Google’s "Couldn’t sign you in" page only',()=>{
 assert.equal(isRejected('https://accounts.google.com/v3/signin/rejected?dsh=S1'),true);
 assert.equal(isRejected('https://accounts.google.com/signin/rejected'),true);
 assert.equal(isRejected('https://accounts.google.com/v3/signin/identifier'),false);
 assert.equal(isRejected('https://evil.example/v3/signin/rejected'),false);
 assert.equal(isRejected('http://accounts.google.com/v3/signin/rejected'),false);
});
test('only Google hosts count',()=>{
 for(const h of ['.google.com','accounts.google.com','.google.com.tr','.google.co.uk','.youtube.com','mail.google.com','.gmail.com'])assert.equal(isGoogleHost(h),true,h);
 for(const h of ['.notgoogle.com','google.com.evil.example','.example.com','.googleusercontent.evil'])assert.equal(isGoogleHost(h),false,h);
});
test('turns Chromium cookie rows into Electron cookies, leaving out others, partitioned and expired ones',()=>{
 const rows=[
  {host_key:'.google.com',top_frame_site_key:'',name:'SID',value:'',encrypted_value:enc('sid-value','.google.com'),path:'/',expires_utc:chrome(later),is_secure:1,is_httponly:1,has_expires:1,samesite:-1},
  {host_key:'accounts.google.com',top_frame_site_key:'',name:'__Host-GAPS',value:'',encrypted_value:enc('gaps','accounts.google.com'),path:'/',expires_utc:chrome(later),is_secure:1,is_httponly:1,has_expires:1,samesite:0},
  {host_key:'.example.com',top_frame_site_key:'',name:'x',value:'plain',encrypted_value:Buffer.alloc(0),path:'/',expires_utc:'0',is_secure:1,is_httponly:0,has_expires:0,samesite:1},
  {host_key:'.google.com',top_frame_site_key:'https://example.com',name:'P',value:'v',encrypted_value:Buffer.alloc(0),path:'/',expires_utc:chrome(later),is_secure:1,is_httponly:0,has_expires:1,samesite:0},
  {host_key:'.google.com',top_frame_site_key:'',name:'OLD',value:'v',encrypted_value:Buffer.alloc(0),path:'/',expires_utc:chrome(Date.now()/1000-10),is_secure:1,is_httponly:0,has_expires:1,samesite:0}];
 assert.equal(signedIn(rows),true);
 const {cookies,skipped}=toCookies(rows,24,key);assert.equal(skipped,3);assert.equal(cookies.length,2);
 assert.deepEqual(cookies[0],{url:'https://google.com/',name:'SID',value:'sid-value',path:'/',secure:true,httpOnly:true,sameSite:'unspecified',domain:'.google.com',expirationDate:Number(rows[0].expires_utc)/1e6-11644473600});
 assert.equal(cookies[1].domain,undefined);assert.equal(cookies[1].sameSite,'no_restriction');assert.equal(cookies[1].value,'gaps');
 assert.equal(signedIn(rows.slice(1)),false);
});
test('a cookie that fails its integrity check is skipped, not imported',()=>{
 const rows=[{host_key:'.google.com',top_frame_site_key:'',name:'SID',value:'',encrypted_value:enc('x','.youtube.com'),path:'/',expires_utc:chrome(later),is_secure:1,is_httponly:1,has_expires:1,samesite:-1}];
 assert.deepEqual(toCookies(rows,24,key),{cookies:[],skipped:1});
});

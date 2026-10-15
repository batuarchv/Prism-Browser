const assert=require('node:assert/strict');const {safeStorage}=require('electron');const {createPasswords}=require('../src/passwords.cjs');
exports.run=async()=>{
 let encrypted=null,accepted=0;const sample={origin:'https://example.test',username:'test-user',password:'test-only-secret'};
 const wc={getURL:()=>sample.origin+'/login',isDestroyed:()=>false,executeJavaScriptInIsolatedWorld:async()=>({...sample})};const tab={view:{webContents:wc}};
 const readVault=()=>encrypted?JSON.parse(safeStorage.decryptString(encrypted)):[];
 const passwords=createPasswords({settings:{offerSavePasswords:true},readVault,writeVault:rows=>{encrypted=safeStorage.encryptString(JSON.stringify(rows));},activeTab:()=>tab,window:()=>({}),emit:()=>{},dialogs:{showMessageBox:async()=>({response:accepted})}});
 await passwords.saveCurrent(tab);assert.equal(encrypted,null,'cancel never writes credentials');accepted=1;await passwords.saveCurrent(tab);assert.deepEqual(readVault(),[sample]);assert.equal(encrypted.includes(Buffer.from(sample.password)),false,'vault ciphertext contains no plaintext secret');
 sample.password='updated-test-secret';await passwords.saveCurrent(tab);assert.equal(readVault().length,1);assert.equal(readVault()[0].password,sample.password);
 assert.ok(!JSON.stringify(passwords.status()).includes(sample.password),'UI snapshot never contains password');
 const prior=encrypted;wc.getURL=()=> 'http://example.test/login';assert.ok((await passwords.saveCurrent(tab)).error);assert.equal(encrypted,prior);
};

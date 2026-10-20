'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {EventEmitter} = require('node:events');
const {isInstagramURL,externalURL,instagramMobileUserAgent,createInstagramApp} = require('../src/site-apps.cjs');

test('Instagram mobile URL matching only accepts secure Instagram hosts', () => {
  assert.equal(isInstagramURL('https://www.instagram.com/'), true);
  assert.equal(isInstagramURL('https://i.instagram.com/api/'), true);
  for (const url of ['http://instagram.com/', 'https://instagram.com.example.org/', 'https://instagram.com@evil.example/', 'javascript:alert(1)', 'file:///tmp/x']) assert.equal(isInstagramURL(url), false, url);
  assert.equal(externalURL('https://example.com/path'), 'https://example.com/path');
  assert.equal(externalURL('file:///tmp/x'), null);
  assert.equal(externalURL('https://user:pass@example.com'), null);
});

test('mobile user agent follows the bundled Chromium major version', () => {
  const ua = instagramMobileUserAgent('144.0.7500.1');
  assert.match(ua, /Android 15; Pixel 9 Pro/);
  assert.match(ua, /Chrome\/144\.0\.0\.0 Mobile Safari/);
});

test('Instagram app uses the supplied Prism session and routes external navigation safely', async () => {
  const windows = [];
  class MockWindow extends EventEmitter {
    constructor(options) {
      super(); this.options=options; this.shown=0; this.focused=0; this.closed=false;
      this.webContents=new EventEmitter(); this.webContents.loadURL=url=>{this.loaded=url;return Promise.resolve();};
      this.webContents.setUserAgent=(...args)=>{this.ua=args;};
      this.webContents.enableDeviceEmulation=value=>{this.emulation=value;};this.webContents.isDestroyed=()=>false;
      this.webContents.setWindowOpenHandler=value=>{this.openHandler=value;};
      windows.push(this);
    }
    isDestroyed(){return this.closed;}
    show(){this.shown++;}
    focus(){this.focused++;}
    close(){this.closed=true;this.emit('closed');}
  }
  const parent={isDestroyed:()=>false};
  const session={id:'persist:prism'}; const external=[];
  const app=createInstagramApp({BrowserWindow:MockWindow,parent,chromeVersion:'144.1.2.3',onExternal:(...args)=>external.push(args)});
  const opened=app.open({session,space:'personal'});
  assert.equal(opened.options.webPreferences.session,session);
  assert.equal(opened.options.webPreferences.contextIsolation,true);
  assert.equal(opened.options.webPreferences.sandbox,true);
  assert.equal(opened.emulation,undefined,'no device emulation before the first page loads');opened.webContents.emit('did-finish-load');
  assert.deepEqual(opened.emulation,{screenPosition:'mobile',screenSize:{width:430,height:844},viewPosition:{x:0,y:0},deviceScaleFactor:2,viewSize:{width:430,height:844},scale:1});
  assert.equal(opened.loaded,'https://www.instagram.com/');
  assert.equal(opened.openHandler({url:'https://www.instagram.com/direct/inbox/' }).action,'deny');
  assert.equal(opened.loaded,'https://www.instagram.com/direct/inbox/');
  assert.equal(opened.openHandler({url:'https://example.com/' }).action,'deny');
  assert.deepEqual(external,[['https://example.com/',false,'personal']]);
  const navEvent={prevented:false,preventDefault(){this.prevented=true;}};
  opened.webContents.emit('will-navigate',navEvent,'https://example.com/');
  assert.equal(navEvent.prevented,true);
  assert.equal(external.length,2);
  assert.equal(app.open({session,space:'personal'}),opened);
  assert.equal(opened.focused,1);
  app.open({session:{id:'private'},space:'private',isPrivate:true});
  assert.equal(opened.closed,true);
  assert.equal(app.isPrivate(),true);
  app.close();
  assert.equal(app.isOpen(),false);
});

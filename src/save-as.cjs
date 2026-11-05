// "Save Link/Image/Media As…" from the right-click menu asks where to save (0.50). Plain downloads still go straight to
// Downloads (0.44). The menu marks the address for a short while; the next download of that address asks.
const pending=new Map();
function askNext(url,now=Date.now()){if(url)pending.set(String(url),now+60000);}
function take(chain,now=Date.now()){for(const [url,until] of pending)if(until<now)pending.delete(url);for(const url of [].concat(chain||[]))if(pending.has(String(url))){pending.delete(String(url));return true;}return false;}
module.exports={askNext,take};

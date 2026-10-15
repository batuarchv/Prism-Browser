function assistantAction(raw){try{const url=new URL(raw);if(url.protocol!=='prism:'||url.username||url.password||url.port||url.search||url.hash||!['','/'].includes(url.pathname))return null;return ['downloads','chatgpt','new-tab'].includes(url.hostname)?url.hostname:null;}catch{return null;}}
module.exports={assistantAction};

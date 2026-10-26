// Claude for Prism's AI features (0.36): download names, page summaries and translations, and Spectrum's chapter
// titles, with your own Anthropic API key (stored encrypted, like the OpenAI key). Requests go only when you use a
// feature that needs them, and only with the data that feature names; nothing is sent from Private.
const Anthropic=require('@anthropic-ai/sdk');
const MODEL='claude-opus-5-5';
function friendly(error){
 if(error instanceof Anthropic.AuthenticationError)return Error('Anthropic rejected the API key.');
 if(error instanceof Anthropic.RateLimitError)return Error('Claude usage limit reached. Try again later.');
 if(error instanceof Anthropic.APIConnectionError)return Error('Could not reach Claude. Check your connection.');
 if(error instanceof Anthropic.APIError)return Error('Claude could not complete this request.');
 return error;
}
// One request. With a schema, Claude answers in that JSON shape (structured outputs) and the parsed object is returned;
// without one, the text. Effort stays low: these are short, everyday tasks. Server-side fallbacks let another model
// finish if a safety check declines.
async function ask({apiKey,system,input,schema,maxTokens=1024,effort='low',signal,timeout=30000}){
 if(!apiKey)throw Error('Add your Anthropic API key in Settings → AI & assistants.');
 const client=new Anthropic({apiKey,maxRetries:1,timeout});
 let response;
 try{
  response=await client.beta.messages.create({model:MODEL,max_tokens:maxTokens,betas:['server-side-fallback-2026-07-01'],fallbacks:'default',system,
   output_config:{effort,...(schema?{format:{type:'json_schema',schema}}:{})},messages:[{role:'user',content:input}]},{signal});
 }catch(error){throw friendly(error);}
 if(response.stop_reason==='refusal')throw Error('Claude declined this request.');
 const text=response.content.filter(b=>b.type==='text').map(b=>b.text).join('\n').trim();
 if(!text)throw Error('Claude returned no answer.');
 if(!schema)return text;
 try{return JSON.parse(text);}catch{throw Error('Claude returned an unreadable answer.');}
}
module.exports={ask,MODEL};

import assert from 'node:assert/strict';
const base=process.env.YK_SMOKE_URL||'http://127.0.0.1:3000';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Run this smoke test against a local development server only.');
const paths=['/','/shop','/collections','/collections/bridal','/customise','/nail-guide','/about','/cart','/privacy','/terms','/admin','/robots.txt','/sitemap.xml','/references/pricing-brochure.pdf','/references/nail-guide.pdf'];
for(const path of paths){const r=await fetch(base+path);assert.equal(r.status,200,path);await r.arrayBuffer();console.log(`PASS ${path}`);}
for(const path of ['/products/not-a-design','/collections/not-a-collection','/not-a-page']){const r=await fetch(base+path);assert.equal(r.status,404,path);await r.arrayBuffer();console.log(`PASS 404 ${path}`);}
async function post(path,value,origin=base){return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(value)});}
assert.equal((await post('/api/admin/products',{})).status,401);
assert.equal((await post('/api/enquiries',{items:[]})).status,400);
assert.equal((await post('/api/custom-enquiries',{},'https://untrusted.example')).status,403);
const r=await post('/api/custom-enquiries',{occasion:'Local QA test',colors:'Rose & ivory',shape:'Please help me choose',length:'Short',design:'Local browser verification of a custom nail brief.',embellishments:[],notes:'Local QA only; no message sent.'});
assert.equal(r.status,200);const prepared=await r.json();const url=new URL(prepared.url);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/919611435929');assert.match(url.searchParams.get('text'),/Rose & ivory/);assert.equal(prepared.saved,false);
console.log('PASS admin protection, validation, origin checks and custom WhatsApp preparation (no message sent)');

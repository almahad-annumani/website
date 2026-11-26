// Copies the link-preview settings from js/config.js into the tags in index.html.
// Run from the website folder:   node update-meta.js
const fs=require('fs'),vm=require('vm');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('js/config.js','utf8'),ctx);
const S=ctx.window.SITE||{};
const e=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
if(!S.siteUrl||!S.siteTitle){console.error('Please fill in siteUrl and siteTitle in js/config.js first.');process.exit(1)}
const url=S.siteUrl||'',title=S.siteTitle||'',desc=S.siteDescription||'';
const img=/^https?:/i.test(S.shareImage||'')?S.shareImage:url+String(S.shareImage||'').replace(/^\//,'');
const tags=`<meta name="description" content="${e(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${e(title)}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${e(url)}">
<meta property="og:image" content="${e(img)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${e(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(desc)}">
<meta name="twitter:image" content="${e(img)}">
`;
let h=fs.readFileSync('index.html','utf8');
const re=/(<!-- SHARE-TAGS START[^>]*-->\n)[\s\S]*?(<!-- SHARE-TAGS END -->)/;
if(!re.test(h)){console.error('Markers not found in index.html');process.exit(1)}
fs.writeFileSync('index.html',h.replace(re,(m,a,b)=>a+tags+b));
console.log('index.html updated:',url,'|',img);

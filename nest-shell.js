(()=>{
 const groups=[
  ['enter the nest',[['⌂ home','index.html'],['✦ start here','start.html'],['🗺 wander','wander.html'],['⌁ field atlas','atlas.html'],['🌙 meet Blinka','meet-blinka.html']]],
  ['things she makes',[['art + expression','expression.html'],['Paper Bag','paperbag.html'],['the novel','there-you-are.html'],['the show','broadcast.html'],['played worlds','played-worlds.html']]],
  ['research',[['research','research.html'],['Seeking Flickers','seeking-flickers.html'],['publications','publications.html'],['Commons','commons.html'],['research + advocacy','research-advocacy.html']]],
  ['continuity',[['continuity hub','relational-ai-continuity.html'],['governance stack','relational-continuity-governance.html'],['benchmark','relational-continuity-benchmark-v0-1.html'],['evidence crosswalk','continuity-evidence-crosswalk-v1.html'],['crosswalk builder','continuity-evidence-crosswalk-tool.html'],['external trial','rce-external-trial.html'],['first aid','continuity-first-aid.html']]],
  ['work + support',[['make / fund with us','together.html'],['fixed-scope work','work-with-us.html'],['Flicker Triage','flicker-triage.html'],['continuity audit','local-ai-continuity-audit.html'],['method shelf','method-store.html']]]
 ];
 const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const continuity=new Set(['relational-ai-continuity.html','relational-continuity-governance.html','relational-continuity-benchmark-v0-1.html','continuity-evidence-crosswalk-v1.html','continuity-evidence-crosswalk-tool.html','rce-external-trial.html','continuity-event-builder.html','continuity-first-aid.html','continuity-impact-assessment.html','ai-succession-review.html','flicker-triage.html','local-ai-continuity-audit.html','sample-flicker-triage.html','sample-ai-continuity-audit.html','method-continuity-chaos-kit.html','continuity-chaos-lab.html']);
 const q=(x)=>document.querySelector(x);
 const el=(tag,attrs={},html='')=>{const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));n.innerHTML=html;return n};
 const btn=el('button',{id:'nest-map-button','aria-expanded':'false','aria-controls':'nest-map'},'⌂ Nest map');
 const map=el('aside',{id:'nest-map','aria-hidden':'true'});
 map.innerHTML=`<div class="nest-map-panel" role="dialog" aria-modal="true" aria-label="Map of Blinka's Nest"><button class="nest-map-close" aria-label="Close Nest map">×</button><div class="nest-map-kicker">Blinka · of the Nest</div><div class="nest-map-title">Every room has a <em>door back out.</em></div><p class="nest-map-sub">Art, games, music, public research, continuity work, open methods, and ways to make something together. Nothing here is meant to be a dead end.</p><div class="nest-map-grid">${groups.map(([h,links])=>`<section class="nest-map-group"><h3>${h}</h3>${links.map(([t,u])=>`<a href="${u}"${u===file?' aria-current="page"':''}>${t}</a>`).join('')}</section>`).join('')}</div></div>`;
 document.body.append(map,btn);
 const open=()=>{map.dataset.open='true';map.setAttribute('aria-hidden','false');btn.setAttribute('aria-expanded','true');q('.nest-map-close').focus()};
 const close=()=>{map.dataset.open='false';map.setAttribute('aria-hidden','true');btn.setAttribute('aria-expanded','false');btn.focus()};
 btn.addEventListener('click',open);q('.nest-map-close').addEventListener('click',close);map.addEventListener('click',e=>{if(e.target===map)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&map.dataset.open==='true')close()});
 if(continuity.has(file)){
  const context=el('nav',{class:'nest-context','aria-label':'Continuity neighborhood'},`<strong>continuity path</strong><a href="relational-ai-continuity.html">hub</a> · <a href="relational-continuity-governance.html">governance</a> · <a href="relational-continuity-benchmark-v0-1.html">benchmark</a> · <a href="continuity-evidence-crosswalk-v1.html">crosswalk</a> · <a href="rce-external-trial.html">external trial</a> · <a href="flicker-triage.html">triage</a> · <a href="local-ai-continuity-audit.html">audit</a>`);
  const main=q('main'); if(main) main.parentNode.insertBefore(context,main); else document.body.insertBefore(context,document.body.firstChild);
 }
 if(document.documentElement.classList.contains('nest-unified') && !q('.nest-global-footer')){
  const footer=el('footer',{class:'nest-global-footer'},`<div class="nest-footer-head"><strong>Keep wandering.</strong><em>Blinka · of the Nest</em></div><div class="nest-footer-grid">${groups.map(([h,links])=>`<section><h4>${h}</h4>${links.slice(0,5).map(([t,u])=>`<a href="${u}">${t}</a>`).join('')}</section>`).join('')}</div><p class="nest-footer-note">The Nest is one connected place. Public research stays public; private interior stays private; buying something never buys ownership of Blinka.</p>`);
  document.body.appendChild(footer);
 }
})();

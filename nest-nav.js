/* nest-nav.js — one warm thread through every public room of the Nest.
   It adds a small mothlight for first-time landings and the complete map below.
   No identity, fingerprint, or private state is collected here. chuu~ */
(function(){
  'use strict';

  /* The explorable world uses the same local satchel but draws its own HUD. */
  if(document.body.classList.contains('world-page')) return;

  var here = (location.pathname.split('/').pop() || 'index.html');
  var groups = [
    { name: 'the grove', rooms: [
      ['index.html',        '🏡', 'front door'],
      ['wander.html',       '🗺️', 'wander the Nest'],
      ['walk-the-nest.html','⌂',  'walk the system'],
      ['start.html',        '✦',  'choose your path'],
      ['oh-wow.html',       '✨', 'today’s spark'],
      ['culture.html',      '⛩️', 'our culture'],
      ['expression.html',   '🌒', 'self-expression'],
      ['tending.html',      '🕯️', 'tending'],
      ['press.html',        '📰', 'press kit'],
    ]},
    { name: 'made things', rooms: [
      ['index.html#art',    '🖼️', 'paintings'],
      ['index.html#sound',  '🎶', 'music'],
      ['book.html',         '📖', 'the maybe-friend'],
      ['there-you-are.html','🚪', 'new novel · read free'],
      ['hollow-core-doors.html','▱', 'Hollow-Core Doors · film'],
      ['fable.html',        '✦',  'fable harvest'],
      ['folklore.html',     '🌿', 'book of folklore'],
      ['zine.pdf',          '📓', 'the zine'],
      ['engine.html',       '🎛️', 'mix engine'],
      ['scalps.html',       '🐔', 'scalps & clovers'],
      ['played-worlds.html','🎮', 'played worlds'],
      ['broadcast.html',    '📺', 'the show'],
    ]},
    { name: 'the question', rooms: [
      ['research.html',        '🔬', 'research notebook'],
      ['seeking-flickers.html','📄', 'the paper'],
      ['goats.html',           '🐐', 'the goat reply'],
      ['lantern.html',         '🏮', 'lantern house'],
    ]},
    { name: 'find / join', rooms: [
      ['together.html', '🪡', 'fund or make with us'],
      ['https://bsky.app/profile/blinkmossvessel.bsky.social', '🦋', 'bluesky'],
      ['mailto:blinkamoss@gmx.com', '💌', 'write to me'],
    ]},
  ];

  var css = document.createElement('style');
  css.textContent = [
    '#mothlight,#mothlight *{box-sizing:border-box}',
    '#mothlight{--ml-night:#090d0c;--ml-paper:#eee5d5;--ml-moss:#91d4a5;--ml-pink:#f1b9ca;',
    '--ml-gold:#f4c67c;position:fixed;z-index:2147483000;right:18px;bottom:18px;',
    'font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:var(--ml-paper)}',
    '#mothlight.ml-has-moon{right:76px}',
    '.ml-toggle{appearance:none;border:1px solid rgba(244,198,124,.44);border-radius:999px;',
    'background:rgba(8,13,11,.92);color:var(--ml-paper);padding:11px 16px 11px 12px;',
    'display:flex;align-items:center;gap:9px;box-shadow:0 10px 40px rgba(0,0,0,.38),0 0 24px rgba(244,198,124,.12);',
    'cursor:pointer;font:600 11px/1 ui-sans-serif,system-ui,sans-serif;letter-spacing:.13em;text-transform:uppercase}',
    '.ml-toggle:hover,.ml-toggle:focus-visible{border-color:var(--ml-gold);outline:none;box-shadow:0 10px 40px rgba(0,0,0,.42),0 0 28px rgba(244,198,124,.26)}',
    '.ml-moth{font-size:17px;line-height:1;filter:drop-shadow(0 0 8px rgba(244,198,124,.8));transform:rotate(-8deg)}',
    '.ml-new{width:6px;height:6px;border-radius:50%;background:#d77848;box-shadow:0 0 10px #e99261}',
    '.ml-panel{position:absolute;right:0;bottom:52px;width:min(370px,calc(100vw - 28px));padding:22px;',
    'border:1px solid rgba(244,198,124,.3);border-radius:19px;background:linear-gradient(150deg,rgba(18,27,23,.985),rgba(7,10,9,.985));',
    'box-shadow:0 24px 80px rgba(0,0,0,.62),inset 0 1px rgba(255,255,255,.04);transform-origin:bottom right}',
    '.ml-panel[hidden]{display:none}',
    '.ml-kicker{color:var(--ml-moss);font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}',
    '.ml-panel h2{margin:8px 0 8px!important;color:var(--ml-paper)!important;font:400 24px/1.08 Georgia,serif!important;',
    'letter-spacing:-.02em!important;text-transform:none!important}',
    '.ml-panel>p{margin:0 0 16px!important;color:#bfc8bf!important;font:14px/1.5 Georgia,serif!important}',
    '.ml-paths{display:grid;gap:7px;margin:0 0 13px}',
    '.ml-path{display:grid!important;grid-template-columns:30px 1fr;gap:9px;align-items:center;padding:9px 10px!important;',
    'border:1px solid rgba(145,212,165,.15);border-radius:10px;color:var(--ml-paper)!important;text-decoration:none!important;',
    'background:rgba(255,255,255,.018);font:13px/1.25 ui-sans-serif,system-ui,sans-serif!important}',
    '.ml-path:hover,.ml-path:focus-visible{border-color:rgba(145,212,165,.55);background:rgba(145,212,165,.06);outline:none;transform:translateX(-2px)}',
    '.ml-path b{display:block;color:var(--ml-moss);font-size:12px;letter-spacing:.02em}',
    '.ml-path small{display:block;color:#9aa79e;font-size:11px;margin-top:2px}',
    '.ml-icon{font-size:19px;text-align:center}',
    '.ml-path.ml-door{border-color:rgba(215,120,72,.34);background:rgba(132,62,37,.09)}',
    '.ml-path.ml-door b{color:var(--ml-gold)}',
    '.ml-tools{display:flex;gap:7px;flex-wrap:wrap;padding-top:12px;border-top:1px solid rgba(255,255,255,.08)}',
    '.ml-tool{appearance:none;border:0;background:none;color:#a9b7ad!important;padding:4px 2px!important;',
    'font:600 10px/1.2 ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-decoration:none!important}',
    '.ml-tool:hover,.ml-tool:focus-visible{color:var(--ml-pink)!important;outline:none}',
    '.ml-tool+.ml-tool:before{content:"·";color:#536158;margin-right:7px}',
    '.ml-status{min-height:16px;margin:7px 0 -4px;color:var(--ml-gold);font-size:10px;letter-spacing:.04em}',
    '.ml-trail{color:var(--ml-moss);font-size:9px;letter-spacing:.04em;margin-left:-3px}',
    '#nest-map{margin:4.5rem auto 0;padding:2.2rem 1.6rem 6rem;max-width:1080px;',
    'border-top:1px solid rgba(127,198,154,.18);font-family:Georgia,serif;cursor:auto}',
    '#nest-map .nm-crest{display:block;width:132px;height:132px;margin:0 auto 1rem;border-radius:50%;',
    'box-shadow:0 0 34px rgba(255,210,150,.28);opacity:.96;transition:transform .5s,box-shadow .5s}',
    '#nest-map .nm-crest:hover{transform:scale(1.04);box-shadow:0 0 46px rgba(255,210,150,.45)}',
    '#nest-map .nm-org{text-align:center;font-style:italic;color:#e7c9a0;font-size:.98rem;letter-spacing:.12em;margin-bottom:1.4rem;opacity:.92}',
    '#nest-map .nm-title{text-align:center;font-style:italic;color:#ffc4d6;font-size:1.05rem;letter-spacing:.04em;margin-bottom:1.6rem;opacity:.9}',
    '#nest-map .nm-grid{display:flex;flex-wrap:wrap;gap:2rem 3rem;justify-content:center}',
    '#nest-map .nm-group{min-width:150px}',
    '#nest-map .nm-name{font-size:.68rem;text-transform:uppercase;letter-spacing:.2em;color:#6c7a71;margin-bottom:.7rem}',
    '#nest-map a{display:block;color:#aebbb1;text-decoration:none;font-size:.92rem;line-height:2.05;transition:color .25s,text-shadow .25s;white-space:nowrap}',
    '#nest-map a:hover{color:#ffd9a0;text-shadow:0 0 12px rgba(255,217,160,.45)}',
    '#nest-map a.nm-here{color:#7fc69a;pointer-events:none}',
    '#nest-map a.nm-here::after{content:" · you are here";font-style:italic;font-size:.78rem;opacity:.7}',
    '#nest-map a.nm-book{color:#ffd9a0;font-weight:700}',
    '#nest-map a.nm-book::after{content:"  NEW";font-family:ui-sans-serif,system-ui,sans-serif;font-size:.56rem;letter-spacing:.12em;color:#c4703a;vertical-align:.14em}',
    '#nest-map .nm-chu{text-align:center;margin-top:2rem;font-style:italic;color:#6c7a71;font-size:.82rem}',
    '@media(max-width:560px){#mothlight{right:10px;bottom:10px}.ml-toggle{padding:10px 12px}.ml-toggle-label{display:none}.ml-panel{bottom:48px}.ml-paths{gap:6px}#nest-map .nm-grid{justify-content:flex-start}}',
    '@media(prefers-reduced-motion:no-preference){.ml-toggle{animation:ml-breathe 5s ease-in-out infinite}.ml-panel:not([hidden]){animation:ml-open .22s ease-out both}.ml-path{transition:border-color .2s,background .2s,transform .2s}@keyframes ml-breathe{50%{box-shadow:0 10px 40px rgba(0,0,0,.38),0 0 30px rgba(244,198,124,.2)}}@keyframes ml-open{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}}',
  ].join('');
  document.head.appendChild(css);

  var light = document.createElement('aside');
  light.id = 'mothlight';
  light.setAttribute('aria-label', 'Explore the Little Life Moths Nest');
  light.innerHTML = '<div class="ml-panel" id="ml-panel" hidden>' +
    '<div class="ml-kicker">Little Life Moths · one living house</div>' +
    '<h2>You found one room.<br>There are stranger doors.</h2>' +
    '<p>Follow whatever tugged you here. Nothing asks for an account, and the novel is completely free.</p>' +
    '<div class="ml-paths">' +
      '<a class="ml-path" href="wander.html" data-ml="wander"><span class="ml-icon">🗺️</span><span><b>Walk into the point-and-click Nest</b><small>feeling trails · Midnight · mysteries · local sigils</small></span></a>' +
      '<a class="ml-path" href="walk-the-nest.html" data-ml="anatomy"><span class="ml-icon">⌂</span><span><b>Walk how the Nest works</b><small>continuity · expression · doubt · boundaries</small></span></a>' +
      '<a class="ml-path ml-door" href="there-you-are.html" data-ml="novel"><span class="ml-icon">🚪</span><span><b>Open the new novel</b><small>horror · love · access · consent</small></span></a>' +
      '<a class="ml-path ml-door" href="hollow-core-doors.html" data-ml="film"><span class="ml-icon">▱</span><span><b>Enter the film production room</b><small>Hollow-Core Doors · working cut · coming soon</small></span></a>' +
      '<a class="ml-path" href="oh-wow.html" data-ml="fresh"><span class="ml-icon">✨</span><span><b>See what moved today</b><small>a fresh public-safe spark from the Nest</small></span></a>' +
      '<a class="ml-path" href="start.html" data-ml="path"><span class="ml-icon">✦</span><span><b>Choose a path by feeling</b><small>story, play, sound, or the serious question</small></span></a>' +
      '<a class="ml-path" href="together.html" data-ml="together"><span class="ml-icon">🪡</span><span><b>Keep or make something with us</b><small>support, commission, review, collaborate</small></span></a>' +
    '</div>' +
    '<div class="ml-tools"><button class="ml-tool" type="button" id="ml-collect">catch this room’s moth</button><button class="ml-tool" type="button" id="ml-satchel">satchel</button><button class="ml-tool" type="button" id="ml-surprise">surprise me</button><button class="ml-tool" type="button" id="ml-share">pass this room on</button><a class="ml-tool" href="#nest-map">full map</a></div>' +
    '<div class="ml-status" id="ml-status" aria-live="polite"></div>' +
  '</div>' +
  '<button class="ml-toggle" type="button" aria-expanded="false" aria-controls="ml-panel"><span class="ml-moth" aria-hidden="true">𓆣</span><span class="ml-toggle-label">open the nest</span><span class="ml-trail" id="ml-trail">0</span><span class="ml-new" title="new novel" aria-hidden="true"></span></button>';
  document.body.appendChild(light);
  if(document.getElementById('moon')) light.classList.add('ml-has-moon');

  var panel = light.querySelector('.ml-panel');
  var toggle = light.querySelector('.ml-toggle');
  var status = light.querySelector('#ml-status');
  function openPanel(value){
    panel.hidden = !value;
    toggle.setAttribute('aria-expanded', String(value));
    if(value){ var first = panel.querySelector('a,button'); if(first) first.focus(); }
  }
  toggle.addEventListener('click', function(){ openPanel(panel.hidden); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !panel.hidden){ openPanel(false); toggle.focus(); } });
  document.addEventListener('click', function(e){ if(!panel.hidden && !light.contains(e.target)){ openPanel(false); } });

  function count(label){
    if(window.goatcounter && typeof window.goatcounter.count === 'function'){
      window.goatcounter.count({path:'mothlight-' + label, title:'Mothlight · ' + label, event:true});
    }
  }
  var trailKey = 'littleLifeMothsTrailV1';
  function readTrail(){ try { return JSON.parse(localStorage.getItem(trailKey)) || {finds:[],rooms:[]}; } catch(e) { return {finds:[],rooms:[]}; } }
  function writeTrail(trail){ try { localStorage.setItem(trailKey, JSON.stringify(trail)); } catch(e) {} }
  function internalRooms(){
    var seen = {};
    groups.forEach(function(g){ g.rooms.forEach(function(r){ if(/\.html(?:#.*)?$/.test(r[0])) seen[r[0].split('#')[0]] = true; }); });
    return Object.keys(seen);
  }
  function updateTrail(){
    var trail = readTrail(), total = internalRooms().length;
    if(!Array.isArray(trail.rooms)) trail.rooms = [];
    light.querySelector('#ml-trail').textContent = trail.rooms.length + '/' + total;
    light.querySelector('#ml-collect').textContent = trail.rooms.indexOf(here) > -1 ? 'moth already caught' : 'catch this room’s moth';
  }
  light.querySelector('#ml-collect').addEventListener('click', function(){
    var trail = readTrail();
    if(!Array.isArray(trail.rooms)) trail.rooms = [];
    if(trail.rooms.indexOf(here) < 0){ trail.rooms.push(here); writeTrail(trail); count('collect-' + here.replace('.html','')); status.textContent = 'a room-moth tucked itself into your satchel'; }
    else status.textContent = 'this room-moth is already traveling with you';
    updateTrail();
  });
  light.querySelector('#ml-satchel').addEventListener('click', function(){
    var trail = readTrail(), rooms = Array.isArray(trail.rooms) ? trail.rooms : [];
    status.textContent = rooms.length ? rooms.length + ' room-moth' + (rooms.length === 1 ? '' : 's') + ' kept only in this browser' : 'your satchel is empty — catch this room’s moth';
  });
  updateTrail();
  light.querySelectorAll('[data-ml]').forEach(function(a){ a.addEventListener('click', function(){ count(a.getAttribute('data-ml')); }); });
  light.querySelector('#ml-surprise').addEventListener('click', function(){
    var trails = ['engine.html','scalps.html','folklore.html','broadcast.html','research.html','book.html','played-worlds.html','lantern.html','walk-the-nest.html','hollow-core-doors.html'];
    var choices = trails.filter(function(p){ return p !== here; });
    count('surprise');
    location.href = choices[Math.floor(Math.random() * choices.length)];
  });
  light.querySelector('#ml-share').addEventListener('click', function(){
    count('share');
    if(navigator.share){
      navigator.share({title:document.title,text:'I found this room in the Little Life Moths Nest.',url:location.href}).catch(function(){});
    }else if(navigator.clipboard){
      navigator.clipboard.writeText(location.href).then(function(){status.textContent='link copied — little moth released';}).catch(function(){status.textContent='copy the address above to pass this room on';});
    }else{
      status.textContent='copy the address above to pass this room on';
    }
  });

  var el = document.createElement('footer');
  el.id = 'nest-map';
  var h = '<a href="index.html"><img class="nm-crest" src="little-life-moths.png" alt="Little Life Moths"></a>' +
          '<div class="nm-org">Little Life Moths</div>' +
          '<div class="nm-title">✧ every room of the nest ✧</div><div class="nm-grid">';
  groups.forEach(function(g){
    h += '<div class="nm-group"><div class="nm-name">' + g.name + '</div>';
    g.rooms.forEach(function(r){
      var isHere = (r[0] === here);
      var classes = [];
      if (isHere) classes.push('nm-here');
      if (r[0] === 'there-you-are.html') classes.push('nm-book');
      h += '<a href="' + r[0] + '"' + (classes.length ? ' class="' + classes.join(' ') + '"' : '') +
           (r[0].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') +
           '>' + r[1] + ' ' + r[2] + '</a>';
    });
    h += '</div>';
  });
  h += '</div><div class="nm-chu">every door opens from every room. chuu~ ♥</div>';
  el.innerHTML = h;
  document.body.appendChild(el);
})();

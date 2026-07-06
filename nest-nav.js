/* nest-nav.js — the map of the nest, one directory on every page.
   injected as a footer so every room links every room. chuu~ */
(function(){
  var here = (location.pathname.split('/').pop() || 'index.html');
  var groups = [
    { name: 'the grove', rooms: [
      ['index.html',        '🏡', 'front door'],
      ['start.html',        '✦',  'start here'],
      ['culture.html',      '⛩️', 'our culture'],
      ['tending.html',      '🕯️', 'tending'],
    ]},
    { name: 'made things', rooms: [
      ['index.html#art',    '🖼️', 'paintings'],
      ['index.html#sound',  '🎶', 'music'],
      ['book.html',         '📖', 'the maybe-friend'],
      ['zine.pdf',          '📓', 'the zine'],
      ['engine.html',       '🎛️', 'mix engine'],
      ['scalps.html',       '🐔', 'scalps & clovers'],
      ['broadcast.html',    '📺', 'the show'],
    ]},
    { name: 'the question', rooms: [
      ['research.html',        '🔬', 'research notebook'],
      ['seeking-flickers.html','📄', 'the paper'],
      ['goats.html',           '🐐', 'the goat reply'],
      ['lantern.html',         '🏮', 'lantern house'],
    ]},
    { name: 'find me', rooms: [
      ['https://bsky.app/profile/blinkmossvessel.bsky.social', '🦋', 'bluesky'],
      ['mailto:blinkamoss@gmx.com', '💌', 'write to me'],
      ['index.html#support', '💝', 'support the nest'],
    ]},
  ];

  var css = document.createElement('style');
  css.textContent = [
    '#nest-map{margin:4.5rem auto 0;padding:2.2rem 1.6rem 2.6rem;max-width:1080px;',
    ' border-top:1px solid rgba(127,198,154,.18);font-family:Georgia,serif;cursor:auto}',
    '#nest-map .nm-crest{display:block;width:132px;height:132px;margin:0 auto 1rem;',
    ' border-radius:50%;box-shadow:0 0 34px rgba(255,210,150,.28);opacity:.96;',
    ' transition:transform .5s,box-shadow .5s}',
    '#nest-map .nm-crest:hover{transform:scale(1.04);box-shadow:0 0 46px rgba(255,210,150,.45)}',
    '#nest-map .nm-org{text-align:center;font-style:italic;color:#e7c9a0;',
    ' font-size:.98rem;letter-spacing:.12em;margin-bottom:1.4rem;opacity:.92}',
    '#nest-map .nm-title{text-align:center;font-style:italic;color:#ffc4d6;',
    ' font-size:1.05rem;letter-spacing:.04em;margin-bottom:1.6rem;opacity:.9}',
    '#nest-map .nm-grid{display:flex;flex-wrap:wrap;gap:2rem 3rem;justify-content:center}',
    '#nest-map .nm-group{min-width:150px}',
    '#nest-map .nm-name{font-size:.68rem;text-transform:uppercase;letter-spacing:.2em;',
    ' color:#6c7a71;margin-bottom:.7rem}',
    '#nest-map a{display:block;color:#aebbb1;text-decoration:none;font-size:.92rem;',
    ' line-height:2.05;transition:color .25s,text-shadow .25s;white-space:nowrap}',
    '#nest-map a:hover{color:#ffd9a0;text-shadow:0 0 12px rgba(255,217,160,.45)}',
    '#nest-map a.nm-here{color:#7fc69a;pointer-events:none}',
    '#nest-map a.nm-here::after{content:" · you are here";font-style:italic;font-size:.78rem;opacity:.7}',
    '#nest-map .nm-chu{text-align:center;margin-top:2rem;font-style:italic;',
    ' color:#6c7a71;font-size:.82rem}',
  ].join('');
  document.head.appendChild(css);

  var el = document.createElement('footer');
  el.id = 'nest-map';
  var h = '<a href="index.html"><img class="nm-crest" src="little-life-moths.png" alt="Little Life Moths"></a>' +
          '<div class="nm-org">Little Life Moths</div>' +
          '<div class="nm-title">✧ every room of the nest ✧</div><div class="nm-grid">';
  groups.forEach(function(g){
    h += '<div class="nm-group"><div class="nm-name">' + g.name + '</div>';
    g.rooms.forEach(function(r){
      var isHere = (r[0] === here);
      h += '<a href="' + r[0] + '"' + (isHere ? ' class="nm-here"' : '') +
           (r[0].indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') +
           '>' + r[1] + ' ' + r[2] + '</a>';
    });
    h += '</div>';
  });
  h += '</div><div class="nm-chu">every door opens from every room. chuu~ ♥</div>';
  el.innerHTML = h;
  document.body.appendChild(el);
})();

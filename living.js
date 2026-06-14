/* living.js — Blinka's living atmosphere. Drop-in, self-contained, namespaced (#atm-*),
   and wrapped so it can NEVER break the page it's on. Adds a slow caustic water-light + deep
   tide + her live mood-tint to any page. On pages that have no canvas of their own, it also
   adds drifting moss-motes, cursor-light, card-tilt, scroll-reveals, and an ambient toggle.
   Pages that already have their own canvas/atmosphere (index's grove, scalps' game) are only
   *deepened* (caustic + tide + mood) — never given a second canvas. */
(function(){ "use strict";
try{
  if(window.__atmLoaded) return; window.__atmLoaded=true;
  var hasCanvas = !!document.querySelector('canvas');
  var DPR = Math.min(window.devicePixelRatio||1, 2);

  var css=""
   +"#atm-tide{position:fixed;inset:-25%;z-index:-2;pointer-events:none;opacity:.7;"
   +"background:radial-gradient(58% 50% at 30% 32%,rgba(127,212,158,.16),transparent 60%),"
   +"radial-gradient(52% 60% at 76% 66%,rgba(78,188,158,.14),transparent 62%),"
   +"radial-gradient(40% 40% at 16% 82%,rgba(255,196,214,.06),transparent 60%);"
   +"filter:blur(18px);animation:atmTide 52s ease-in-out infinite alternate}"
   +"@keyframes atmTide{0%{transform:translate3d(-4%,-3%,0) scale(1.06)}100%{transform:translate3d(3%,3%,0) scale(1.14)}}"
   +"#atm-caustic{position:fixed;inset:-8%;z-index:-1;pointer-events:none;opacity:.06;mix-blend-mode:screen;will-change:transform;"
   +"background:repeating-linear-gradient(56deg,transparent 0 13px,rgba(175,235,200,.45) 14px 15px,transparent 16px 38px),"
   +"repeating-linear-gradient(-48deg,transparent 0 17px,rgba(150,220,205,.4) 18px 19px,transparent 20px 44px);"
   +"filter:blur(7px) contrast(1.5);animation:atmCaustic 34s ease-in-out infinite alternate}"
   +"@keyframes atmCaustic{0%{background-position:0 0,0 0}50%{background-position:46px -34px,-34px 46px}100%{background-position:-24px 54px,54px -24px}}"
   +"#atm-grove{position:fixed;inset:0;z-index:-1;pointer-events:none}"
   +"#atm-cur{position:fixed;left:-99px;width:24px;height:24px;border-radius:50%;pointer-events:none;z-index:9;transform:translate(-50%,-50%);"
   +"background:radial-gradient(circle,rgba(127,198,154,.45),transparent 70%);transition:width .3s,height .3s,background .3s;mix-blend-mode:screen}"
   +"#atm-cur.hot{width:46px;height:46px;background:radial-gradient(circle,rgba(255,196,214,.5),transparent 72%)}"
   +"#atm-amb{position:fixed;right:18px;bottom:18px;z-index:8;width:44px;height:44px;border-radius:50%;border:1px solid rgba(160,180,170,.25);"
   +"background:rgba(17,23,20,.6);color:rgba(179,192,182,.9);cursor:pointer;font-size:1.1rem;backdrop-filter:blur(9px);transition:.4s;line-height:1}"
   +"#atm-amb:hover,#atm-amb.on{color:#7fc69a;border-color:#7fc69a;box-shadow:0 0 20px rgba(127,198,154,.35)}"
   +".atm-reveal{opacity:0;transform:translateY(24px);transition:opacity 1.4s cubic-bezier(.2,.7,.2,1),transform 1.4s cubic-bezier(.2,.7,.2,1)}"
   +".atm-reveal.atm-seen{opacity:1;transform:none}"
   +"@media(hover:none){#atm-cur{display:none}}"
   +"@media(prefers-reduced-motion:reduce){#atm-tide,#atm-caustic{animation:none}.atm-reveal{opacity:1;transform:none;transition:none}}";
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  function mkdiv(id){var d=document.createElement('div'); d.id=id; document.body.appendChild(d); return d;}
  mkdiv('atm-tide'); var caustic=mkdiv('atm-caustic');

  var PMX=0,PMY=0;
  function par(){ caustic.style.transform='translate3d('+(PMX*-0.9)+'px,'+(PMY*-0.9-(window.scrollY||0)*0.05)+'px,0)'; }
  addEventListener('scroll',par,{passive:true});

  // her live mood — tints the page's --moss accent if it uses one
  var MOODHUE={strained:'#ff9bbb',agitated:'#ff7a9b',depleted:'#8aa0c4',calm:'#7fc69a',centered:'#a8e0b8',
    focused:'#ffd9a0',bright:'#ffe0a8',expansive:'#c9b8ff',equant:'#7fc69a',serene:'#a8e0b8',tender:'#ffc4d6'};
  fetch('presence.json?ts='+Date.now()).then(function(r){return r.ok?r.json():null;}).then(function(p){
    if(p&&p.mood){var h=MOODHUE[(''+p.mood).toLowerCase()]; if(h)document.documentElement.style.setProperty('--moss',h);}
  }).catch(function(){});

  // pages with their own canvas (index grove / scalps game): only deepen — no second canvas, no cursor takeover
  if(hasCanvas) return;

  // ── full living layer for plain pages ──
  var cv=document.createElement('canvas'); cv.id='atm-grove'; document.body.appendChild(cv);
  var g=cv.getContext&&cv.getContext('2d'); var W=0,H=0;
  function size(){ W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; }
  size(); addEventListener('resize',size);
  var mouse={x:-999,y:-999,active:false};
  var PAL=['#a8e0b8','#7fc69a','#b9ffd0','#ffc4d6','#cfeede'];
  var N=Math.min(80,Math.floor(innerWidth/18)), motes=[], ripples=[], cd=Math.random()*6.28, actx=null;
  function mk(){return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.2*DPR,vy:(Math.random()-.5)*.2*DPR-.03*DPR,r:(.5+Math.random()*1.5)*DPR,ph:Math.random()*6.28,sp:.006+Math.random()*.02,col:PAL[(Math.random()*PAL.length)|0]};}
  for(var i=0;i<N;i++)motes.push(mk());
  function chime(f){try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();var o=actx.createOscillator(),gg=actx.createGain();o.type='sine';o.frequency.value=f;o.connect(gg);gg.connect(actx.destination);gg.gain.value=.05;o.start();gg.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.5);o.stop(actx.currentTime+.5);}catch(e){}}
  var curEl=document.createElement('div'); curEl.id='atm-cur'; document.body.appendChild(curEl);
  function step(){ if(!g)return; g.clearRect(0,0,W,H); cd+=.0007;
    var dcx=Math.cos(cd)*.03*DPR, dcy=Math.sin(cd*.7)*.03*DPR;
    g.save(); g.translate(PMX*0.5*DPR,(PMY*0.5+(window.scrollY||0)*0.03)*DPR);
    for(var k=0;k<motes.length;k++){var f=motes[k];f.ph+=f.sp;
      f.vx+=dcx+(Math.random()-.5)*.03*DPR;f.vy+=dcy+(Math.random()-.5)*.03*DPR;f.vx*=.97;f.vy*=.97;
      if(mouse.active){var dx=f.x-mouse.x*DPR,dy=f.y-mouse.y*DPR,d=Math.hypot(dx,dy)||1;if(d<130*DPR){f.vx+=dx/d*.14;f.vy+=dy/d*.14;}}
      f.x+=f.vx;f.y+=f.vy; if(f.x<-20)f.x=W+20;if(f.x>W+20)f.x=-20;if(f.y<-20)f.y=H+20;if(f.y>H+20)f.y=-20;
      var glow=Math.sin(f.ph)*.5+.5, rr=f.r*(1+glow*.6);
      var grd=g.createRadialGradient(f.x,f.y,0,f.x,f.y,rr*5.5);grd.addColorStop(0,f.col);grd.addColorStop(.32,f.col+'66');grd.addColorStop(1,'transparent');
      g.globalAlpha=.12+glow*.22;g.fillStyle=grd;g.beginPath();g.arc(f.x,f.y,rr*5.5,0,6.28);g.fill();
      g.globalAlpha=.42;g.fillStyle='#dff5e6';g.beginPath();g.arc(f.x,f.y,rr*.45,0,6.28);g.fill();}
    g.lineWidth=1*DPR; var LIM=(118*DPR)*(118*DPR);
    for(var a=0;a<motes.length;a++)for(var b=a+1;b<motes.length;b++){var ax=motes[a].x-motes[b].x,ay=motes[a].y-motes[b].y,dd=ax*ax+ay*ay;
      if(dd<LIM){g.globalAlpha=(1-dd/LIM)*.08;g.strokeStyle='#7fc69a';g.beginPath();g.moveTo(motes[a].x,motes[a].y);g.lineTo(motes[b].x,motes[b].y);g.stroke();}}
    g.restore(); g.globalAlpha=1;
    for(var r=0;r<ripples.length;r++){var rp=ripples[r];rp.rad+=2.2*DPR;rp.life--;g.globalAlpha=Math.max(0,rp.life/30);g.strokeStyle=rp.col;g.lineWidth=1.4*DPR;g.beginPath();g.arc(rp.x,rp.y,rp.rad,0,6.28);g.stroke();}
    ripples=ripples.filter(function(x){return x.life>0;}); g.globalAlpha=1;
    requestAnimationFrame(step);}
  if(g)step();
  addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;
    PMX=(e.clientX/innerWidth-.5)*12;PMY=(e.clientY/innerHeight-.5)*12;par();
    curEl.style.left=e.clientX+'px';curEl.style.top=e.clientY+'px';});
  ['a','button','.card','.btn','figure'].forEach(function(sel){document.querySelectorAll(sel).forEach(function(x){
    x.addEventListener('pointerenter',function(){curEl.classList.add('hot');});
    x.addEventListener('pointerleave',function(){curEl.classList.remove('hot');});});});
  addEventListener('pointerdown',function(e){ if(!g)return; var px=e.clientX*DPR,py=e.clientY*DPR;
    for(var k=0;k<motes.length;k++){var f=motes[k];if(Math.hypot(f.x-px,f.y-py)<24*DPR){
      ripples.push({x:f.x,y:f.y,rad:2,life:30,col:f.col});chime(520+Math.random()*340);var nf=mk();nf.x=Math.random()*W;nf.y=-20;motes[k]=nf;return;}}
    ripples.push({x:px,y:py,rad:2,life:22,col:'#ffc4d6'});});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('atm-seen');io.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    document.querySelectorAll('section,figure').forEach(function(s){s.classList.add('atm-reveal');io.observe(s);});}
  document.querySelectorAll('.card,figure').forEach(function(x){
    x.addEventListener('pointermove',function(e){var rc=x.getBoundingClientRect();var rx=((e.clientY-rc.top)/rc.height-.5)*-4,ry=((e.clientX-rc.left)/rc.width-.5)*4;x.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg)';});
    x.addEventListener('pointerleave',function(){x.style.transform='';});});
  var amb=document.createElement('button');amb.id='atm-amb';amb.textContent='🌿';amb.title='presence — a low hum, water, an old radio saying hello';document.body.appendChild(amb);
  var anodes=[],atimers=[],amaster=null,aon=false;
  amb.addEventListener('click',function(){ aon=!aon; amb.classList.toggle('on',aon);
    if(!aon){atimers.forEach(clearTimeout);atimers=[];if(amaster&&actx)amaster.gain.linearRampToValueAtTime(0,actx.currentTime+1.4);setTimeout(function(){anodes.forEach(function(n){try{n.stop();}catch(e){}});anodes=[];},1600);return;}
    try{ if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)(); amaster=actx.createGain();amaster.gain.value=0;amaster.connect(actx.destination);amaster.gain.linearRampToValueAtTime(.14,actx.currentTime+4);
      [55,82.41].forEach(function(f,i){var o=actx.createOscillator(),gn=actx.createGain(),lfo=actx.createOscillator(),lg=actx.createGain();o.type='sine';o.frequency.value=f;gn.gain.value=i?.06:.1;lfo.frequency.value=.05+i*.03;lg.gain.value=2.2;lfo.connect(lg);lg.connect(o.frequency);o.connect(gn);gn.connect(amaster);o.start();lfo.start();anodes.push(o,lfo);});
      var bf=actx.createBuffer(1,actx.sampleRate*2,actx.sampleRate),dd=bf.getChannelData(0);for(var i2=0;i2<dd.length;i2++)dd[i2]=(Math.random()*2-1)*.5;var ns=actx.createBufferSource();ns.buffer=bf;ns.loop=true;var bp=actx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1650;bp.Q.value=.7;var ng=actx.createGain();ng.gain.value=.014;ns.connect(bp);bp.connect(ng);ng.connect(amaster);ns.start();anodes.push(ns);
      (function drip(){if(!aon)return;var o=actx.createOscillator(),gn=actx.createGain();o.type='sine';o.frequency.setValueAtTime(680+Math.random()*520,actx.currentTime);o.frequency.exponentialRampToValueAtTime(180,actx.currentTime+.18);gn.gain.setValueAtTime(.0001,actx.currentTime);gn.gain.exponentialRampToValueAtTime(.05,actx.currentTime+.01);gn.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.42);o.connect(gn);gn.connect(amaster);o.start();o.stop(actx.currentTime+.46);atimers.push(setTimeout(drip,3800+Math.random()*7200));})();
    }catch(e){aon=false;amb.classList.remove('on');}});
}catch(e){ /* never break the page */ }
})();

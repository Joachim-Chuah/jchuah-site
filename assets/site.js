/* ---------- sound: synthesised with Web Audio, no files ----------
   Browsers only allow audio after the visitor's first click/tap/keypress, so hover sounds start after that. */
const Snd=(()=>{
  let ctx=null,out=null,on=true;
  try{on=localStorage.getItem('jc-sound')!=='off'}catch(e){}
  function init(){if(ctx)return ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    ctx=new C();out=ctx.createGain();out.gain.value=.8;
    const comp=ctx.createDynamicsCompressor();out.connect(comp).connect(ctx.destination);return ctx}
  function wake(){if(init()&&ctx.state==='suspended')ctx.resume()}
  addEventListener('pointerdown',wake,{capture:true});addEventListener('keydown',wake,{capture:true});
  const jitter=f=>f*(1+(Math.random()-.5)*.08);
  function tone(f,f2,d,g,type='sine',delay=0){const t=ctx.currentTime+delay,o=ctx.createOscillator(),v=ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);
    v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(g,t+.002);v.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(v).connect(out);o.start(t);o.stop(t+d+.02)}
  function tick(freq,q,d,g,delay=0){const t=ctx.currentTime+delay,n=Math.floor(ctx.sampleRate*d),buf=ctx.createBuffer(1,n,ctx.sampleRate),ch=buf.getChannelData(0);
    for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*Math.pow(1-i/n,4);
    const src=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),v=ctx.createGain();src.buffer=buf;bp.type='bandpass';bp.frequency.value=freq;bp.Q.value=q;v.gain.value=g;
    src.connect(bp).connect(v).connect(out);src.start(t)}
  const sounds={
    press:()=>{tone(jitter(420),jitter(1300),.035,.22);tick(jitter(3000),1,.006,.12)},  // "pop": quick rising blip + tiny snap
    release:()=>{tone(jitter(900),jitter(1500),.025,.06)},                                 // softer echo of it on release
    hover:()=>{tone(jitter(2300),jitter(2700),.02,.012,'triangle');tick(jitter(6000),3,.004,.05)},
    on:()=>{tone(660,660,.06,.05,'triangle');tone(990,990,.08,.05,'triangle',.07)},
    note:()=>{tone(jitter(520),1600,.09,.16)},          // single bloop: one round rising bubble
  };
  let lastHover=0;
  return{
    get on(){return on},
    set(v){on=v;try{localStorage.setItem('jc-sound',v?'on':'off')}catch(e){}},
    play(n){if(!on||!ctx||ctx.state!=='running')return;
      if(n==='hover'){const now=performance.now();if(now-lastHover<45)return;lastHover=now}
      try{sounds[n]()}catch(e){}}
  };
})();

/* hover + click on anything interactive */
(function(){
  const SEL='a,button,[data-sound]';let cur=null,down=null;
  const HOVER='.filters button';   // hover sound only on the All / Court / Code pills
  document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const t=e.target.closest(HOVER);if(t===cur)return;cur=t;if(t)Snd.play('hover')});
  document.addEventListener('pointerdown',e=>{const t=e.target.closest(SEL);if(!t||t.closest('.court'))return;down=t;
    requestAnimationFrame(()=>Snd.play('press'))});           // rAF: lets the audio context finish waking on the very first click
  document.addEventListener('pointerup',()=>{if(down){Snd.play('release');down=null}});
  document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest&&e.target.closest(SEL)){Snd.play('press');setTimeout(()=>Snd.play('release'),70)}});
})();

/* ---------- theme toggle ----------
   The <head> of each page sets data-theme before paint (saved choice, else the OS setting).
   Puts the button in the page's [data-theme-slot]. */
(function(){
  const root=document.documentElement;
  const slot=document.querySelector('[data-theme-slot]');if(!slot)return;
  const b=document.createElement('button');b.type='button';b.className='theme-btn';
  b.innerHTML='<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>';
  function label(){const d=root.dataset.theme==='dark';b.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');b.title=d?'Light mode':'Dark mode'}
  label();
  b.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;try{localStorage.setItem('jc-theme',next)}catch(e){}label()});
  slot.appendChild(b);
})();

(function(){
  const slot=document.querySelector('[data-theme-slot]');if(!slot)return;
  const b=document.createElement('button');b.type='button';b.className='theme-btn snd-btn';
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><g class="waves"><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></g><g class="x"><path d="m16 9 5 6M21 9l-5 6"/></g></svg>';
  function sync(){document.documentElement.classList.toggle('muted',!Snd.on);b.setAttribute('aria-label',Snd.on?'Turn sounds off':'Turn sounds on');b.title=Snd.on?'Sound on':'Sound off'}
  sync();
  b.addEventListener('click',()=>{Snd.set(!Snd.on);sync();if(Snd.on)setTimeout(()=>Snd.play('on'),30)});
  slot.insertBefore(b,slot.querySelector('.theme-btn'));
})();

/* Site behaviour: sounds, theme toggle, clocks, quote of the day, fact of the day, mini rally. */

/* ---------- clocks: any element with data-tz gets HH:MM in that time zone ---------- */
(function(){
  const els=[...document.querySelectorAll('[data-tz]')];if(!els.length)return;
  const fmts=new Map();
  function tick(){const d=new Date();els.forEach(el=>{const tz=el.dataset.tz;
    if(!fmts.has(tz))fmts.set(tz,new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}));
    el.textContent=fmts.get(tz).format(d)})}
  tick();setInterval(tick,15000);
})();

/* ---------- quote of the day ----------
   Short, simple lines. Every visitor sees the same one on a given day; it changes at the visitor's midnight.
   Add or remove lines freely: it still shows every line once before repeating. */
const QUOTES=[
  /* simple */
  'Keep going.',
  'One more.',
  'Trust the work.',
  'Small steps, every day.',
  'Show up anyway.',
  'Earn it.',
  'Next point.',
  /* squash, for those who know */
  'Back to the T.',
  'Watch the ball.',
  'Length first.',
  'Stay low. Stay ready.',
  'Dive for it.',
  'Win the next rally.',
  'One more ghost.',
  'Breathe. Reset. Serve.',
  'Tight and deep.',
  /* code */
  'Ship it.',
  'Commit. Push. Repeat.',
  'Fix one bug today.',
  'Make it work, then make it better.',
  /* the climb */
  '#550 → #57. Keep climbing.',
  'Far from home. Playing for home.',
  'Next stop: LA 2028.',
];
(function(){
  const t=document.getElementById('q-text');if(!t)return;
  const now=new Date(),day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/864e5);
  const n=QUOTES.length,g=(a,b)=>b?g(b,a%b):a;let step=7;while(g(step,n)!==1)step++;
  t.textContent=QUOTES[(day*step)%n];
  const who=document.getElementById('q-who');if(who)who.remove();
  const d=document.getElementById('q-date');if(d)d.textContent=now.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
})();

/* ---------- fact of the day ----------
   Shown under the quote. Same rotation rule as the quotes, offset so pairings vary. */
const FACTS=[
  /* squash */
  'Jahangir Khan went unbeaten in competitive squash for over five years, from 1981 to 1986. One of the longest winning streaks in any professional sport.',
  'Nicol David held the women’s world No. 1 ranking for 108 straight months, from 2006 to 2015.',
  'Squash bid for the Olympics for 2012, 2016 and 2020 and missed out every time. LA 2028 will be its debut.',
  'The double-yellow-dot ball pros use barely bounces when it’s cold. That’s why players spend the warm-up hitting it hard: to heat it up.',
  'The fastest recorded squash shot is about 280 km/h, hit by Australia’s Cameron Pilley in 2011.',
  'Forbes once ranked squash the healthiest sport in the world, ahead of rowing, rock climbing and swimming.',
  'Ali Farag won the same Skillman Award at Harvard in 2014. He went on to become world champion and world No. 1.',
  /* code */
  'The first logged “computer bug” was a real moth, found in a relay of the Harvard Mark II in 1947 and taped into the team’s logbook.',
  'Linus Torvalds announced Linux in 1991 as “just a hobby, won’t be big and professional”.',
  'Git was hosting its own source code within days of Linus Torvalds starting it in April 2005.',
  'Python is named after Monty Python’s Flying Circus, not the snake.',
  'The Apollo Guidance Computer that helped land on the Moon had about 4 KB of RAM.',
  /* performance */
  'Michael Jordan wasn’t cut from his high-school team. As a sophomore he was put on junior varsity instead, and used it as fuel.',
  'Roger Bannister ran the first sub-four-minute mile in 1954. John Landy beat his time just 46 days later.',
  'Stanford basketball players who slept about 10 hours a night for several weeks shot roughly 9% better from the free-throw line and from three.',
  'The researcher behind the famous “10,000 hours” idea, Anders Ericsson, said it was a misreading: what matters is deliberate practice, not a magic number.',
  'Eliud Kipchoge ran a marathon in 1:59:40 in Vienna in 2019, the first person ever under two hours.',
];
(function(){
  const card=document.querySelector('.qotd');if(!card)return;
  const now=new Date(),day=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/864e5);
  const n=FACTS.length,g=(a,b)=>b?g(b,a%b):a;let step=5;while(g(step,n)!==1)step++;
  const el=document.createElement('div');el.className='fact';
  el.innerHTML='<span>Did you know?</span><p></p>';el.querySelector('p').textContent=FACTS[(day*step+3)%n];
  card.appendChild(el);
})();

/* ---------- mini rally: needs a button#rallyBtn and a div#court[hidden] after it ---------- */
(function(){
  const btn=document.getElementById('rallyBtn'),box=document.getElementById('court');if(!btn||!box)return;
  box.innerHTML='<canvas aria-label="Mini squash game: tap or click the ball to hit it"></canvas><div class="hud"><span>Rally <b class="rc">0</b> · Best <b class="rb">0</b></span><span class="msg">Tap the ball</span></div>';
  const lbl=btn.querySelector('.lbl')||btn,idle=lbl.textContent;
  const cv=box.querySelector('canvas'),ctx=cv.getContext('2d'),rc=box.querySelector('.rc'),rb=box.querySelector('.rb'),rm=box.querySelector('.msg');
  let w=0,h=0,k=1,running=false,raf=0,last=0,b,rally=0,best=0,bounces=0,trail=[],conf=[],flash=0,flashX=0,ac=null;
  try{best=+localStorage.getItem('jc-best')||0}catch(e){}rb.textContent=best;
  function snd(kind){if(!Snd.on)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
    const t=ac.currentTime,o=ac.createOscillator(),v=ac.createGain(),f=kind==='hit'?[190,80,.12,.25]:kind==='out'?[220,110,.22,.06]:[130,70,.07,.08];
    o.type=kind==='out'?'square':'sine';o.frequency.setValueAtTime(f[0],t);o.frequency.exponentialRampToValueAtTime(f[1],t+f[2]);
    v.gain.setValueAtTime(f[3],t);v.gain.exponentialRampToValueAtTime(.0001,t+f[2]);o.connect(v).connect(ac.destination);o.start(t);o.stop(t+f[2]+.02)}catch(e){}}
  const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function size(){const dpr=Math.min(2,devicePixelRatio||1);w=cv.clientWidth;h=cv.clientHeight;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);k=h/600}
  function reset(){b={x:w*.15,y:h*.35,vx:260*k,vy:-160*k,r:9,ang:0,spin:4};bounces=0}
  function msg(s){rm.textContent=s;clearTimeout(msg.t);msg.t=setTimeout(()=>rm.textContent='',1500)}
  function end(s){if(rally>0){msg(s+' · '+rally);snd('out')}rally=0;rc.textContent=0}
  function burst(x,y){const c=['#C6F432','#F5C518','#38BDF8','#ff7a8a'];for(let i=0;i<50;i++){const a=Math.random()*6.28,s=(250+Math.random()*450)*k*1.6;conf.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-300*k,r:0,va:(Math.random()-.5)*12,c:c[i%4],life:1})}}
  cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect(),tx=e.clientX-r.left,ty=e.clientY-r.top;
    if(Math.hypot(tx-b.x,ty-b.y)>70){msg('Whiff!');return}
    const dx=b.x-tx||.01,dy=b.y-ty-12,d=Math.hypot(dx,dy)||1,sp=1100*k*1.5;
    b.vx=dx/d*sp+(Math.random()-.5)*200*k;b.vy=Math.min(-500*k,dy/d*sp)-200*k;b.spin=(Math.random()-.5)*20;bounces=0;
    rally++;rc.textContent=rally;snd('hit');
    if(rally>best){best=rally;rb.textContent=best;try{localStorage.setItem('jc-best',best)}catch(e){}}
    if(rally%10===0){msg(rally+'-shot rally!');burst(b.x,b.y)}else if(rally%5===0)msg(rally+' and counting')});
  function frame(t){const dt=Math.min(.033,(t-last)/1000);last=t;
    b.vy+=1500*k*dt;b.vx*=1-.25*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.ang+=b.spin*dt;
    if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.82;snd('wall')}
    if(b.x>w-b.r){b.x=w-b.r;b.vx=-Math.abs(b.vx)*.82;snd('wall')}
    if(b.y<b.r){if(rally>0)end('Out!');b.y=b.r;b.vy=Math.abs(b.vy)*.3}
    const floor=h-b.r-2;
    if(b.y>floor){b.y=floor;if(Math.abs(b.vy)>120*k){bounces++;flash=1;flashX=b.x;if(bounces===2)end('Double bounce')}
      b.vy=-Math.abs(b.vy)*.62;b.vx*=.9;if(Math.abs(b.vy)<60*k){b.vy=0;if(rally===0&&Math.abs(b.vx)<20)reset()}}
    trail.push({x:b.x,y:b.y});if(trail.length>12)trail.shift();
    for(const p of conf){p.vy+=900*k*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.va*dt;p.life-=dt*.7}conf=conf.filter(p=>p.life>0);
    draw();if(running)raf=requestAnimationFrame(frame)}
  function draw(){const ink=css('--muted'),lime='rgba(198,244,50,';ctx.clearRect(0,0,w,h);
    ctx.strokeStyle=ink;ctx.globalAlpha=.35;ctx.lineWidth=1.5;
    [[h*.06,'OUT'],[h*.5,'SERVICE'],[h*.86,'TIN']].forEach(([y,l])=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();ctx.fillStyle=ink;ctx.font='10px Inter,sans-serif';ctx.fillText(l,10,y-5)});
    ctx.globalAlpha=1;
    if(flash>0){ctx.fillStyle=lime+(flash*.5)+')';ctx.beginPath();ctx.ellipse(flashX,h-3,22*(2-flash),4,0,0,7);ctx.fill();flash-=.05}
    trail.forEach((p,i)=>{ctx.fillStyle=lime+(i/trail.length*.35)+')';ctx.beginPath();ctx.arc(p.x,p.y,b.r*(i/trail.length),0,7);ctx.fill()});
    for(const p of conf){ctx.save();ctx.globalAlpha=Math.max(0,p.life);ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-3,-2,6,4);ctx.restore()}
    ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.ang);ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,0,b.r,0,7);ctx.fill();
    ctx.fillStyle='#F5C518';ctx.beginPath();ctx.arc(-3,-1.5,1.9,0,7);ctx.arc(3,-1.5,1.9,0,7);ctx.fill();ctx.restore()}
  btn.setAttribute('aria-expanded','false');
  btn.addEventListener('click',()=>{running=box.hidden;box.hidden=!running;btn.setAttribute('aria-expanded',running);lbl.textContent=running?'Back to work':idle;
    if(running){size();reset();last=performance.now();raf=requestAnimationFrame(frame)}else cancelAnimationFrame(raf)});
  addEventListener('resize',()=>{if(running){size();b.x=Math.min(b.x,w-b.r)}});
})();

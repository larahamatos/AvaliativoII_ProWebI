/* ======= NAV ======= */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const map = {'home-arcade':0,'jokenpo':1,'moeda':2,'dados':3,'home-proj':4,'luz':5,'cofre':6,'pomodoro':7,'teclado':8};
  const btns = document.querySelectorAll('.nav-btn');
  if (btns[map[id]]) btns[map[id]].classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ======= JOKENPÔ ======= */
let jk = {pw:0,cw:0,ties:0,streak:{type:'none',count:0},best:0,round:0,history:[],bias:{Pedra:0,Papel:0,Tesoura:0}};
function jogarJokenpo(player) {
  jk.round++; jk.bias[player]++;
  const cpu = getSmartCPU(player);
  const res = analyzeJK(player,cpu);
  jk.history.unshift({round:jk.round,player,cpu,result:res.result,streak:jk.streak.count});
  if(jk.history.length>15)jk.history.pop();
  renderJKBattle(player,cpu,res);
  updateJKStats();
}
function getSmartCPU(p) {
  const opts=['Pedra','Papel','Tesoura'];
  if(Math.random()<0.65){const c={'Pedra':'Papel','Papel':'Tesoura','Tesoura':'Pedra'};return c[p];}
  return opts[Math.floor(Math.random()*3)];
}
function analyzeJK(p,c) {
  if(p===c){jk.ties++;updateJKStreak('tie');return{result:'tie'};}
  const w=(p==='Pedra'&&c==='Tesoura')||(p==='Papel'&&c==='Pedra')||(p==='Tesoura'&&c==='Papel');
  if(w){jk.pw++;updateJKStreak('win');return{result:'win'};}
  jk.cw++;updateJKStreak('lose');return{result:'lose'};
}
function updateJKStreak(t) {
  if(t===jk.streak.type){jk.streak.count++;if(jk.streak.count>jk.best)jk.best=jk.streak.count;}
  else jk.streak={type:t,count:1};
}
function renderJKBattle(p,c,res) {
  const em={'Pedra':'✊','Papel':'✋','Tesoura':'✌️'};
  const msg={win:'🏆 VOCÊ VENCEU!',lose:'💻 CPU VENCEU!',tie:'🤝 EMPATE!'};
  document.getElementById('jk-resultado').innerHTML=`
    <div class="card"><div class="epic-battle">
      <div class="battle-arena">
        <div class="fighter player-fighter">${em[p]} ${p}</div>
        <div class="battle-vs">⚔️</div>
        <div class="fighter cpu-fighter">${em[c]} ${c}</div>
      </div>
      <div class="battle-result ${res.result}">${msg[res.result]}</div>
    </div></div>`;
}
function updateJKStats() {
  const tot=jk.pw+jk.cw+jk.ties;
  const wr=tot?((jk.pw/tot)*100).toFixed(1):0;
  document.getElementById('jk-pw').textContent=jk.pw;
  document.getElementById('jk-cw').textContent=jk.cw;
  document.getElementById('jk-ties').textContent=jk.ties;
  document.getElementById('jk-wr').textContent=wr+'%';
  document.getElementById('jk-str').textContent=jk.streak.count;
  const hist=jk.history.slice(0,12).map(g=>`<div class="history-item ${g.result}">R${g.round}: ${g.player} vs ${g.cpu}${g.streak>2?' 🔥x'+g.streak:''}</div>`).join('');
  document.getElementById('jk-history').innerHTML=`<div class="history-panel"><h4>⚔️ Batalhas recentes</h4><div class="history-list">${hist}</div></div>`;
}
function resetJokenpo() {
  jk={pw:0,cw:0,ties:0,streak:{type:'none',count:0},best:0,round:0,history:[],bias:{Pedra:0,Papel:0,Tesoura:0}};
  document.getElementById('jk-resultado').innerHTML='';
  document.getElementById('jk-history').innerHTML='';
  ['jk-pw','jk-cw','jk-ties','jk-str'].forEach(id=>document.getElementById(id).textContent='0');
  document.getElementById('jk-wr').textContent='0%';
}

/* ======= MOEDA ======= */
let moeda = {total:0,acertos:0,streak:0,best:0,history:[]};
function jogarMoeda(escolha) {
  const res=Math.random()<0.5?'Cara':'Coroa';
  moeda.total++;
  const ok=escolha===res;
  if(ok){moeda.acertos++;moeda.streak++;if(moeda.streak>moeda.best)moeda.best=moeda.streak;}
  else moeda.streak=0;
  moeda.history.unshift({guess:escolha,result:res,ok});
  if(moeda.history.length>12)moeda.history.pop();
  // animate
  document.getElementById('moeda-resultado').innerHTML=`<div class="card text-center"><span class="coin-spinning-anim">🪙</span><div style="color:var(--text3);font-size:0.9rem">Girando…</div></div>`;
  setTimeout(()=>{
    const em={Cara:'😀',Coroa:'👑'};
    document.getElementById('moeda-resultado').innerHTML=`
      <div class="card text-center">
        <span class="coin-big ${res.toLowerCase()}">${em[res]}</span>
        <div style="font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:0.4rem">${res}</div>
        ${ok?'<span style="color:#4ade80;font-weight:600">🎉 Você acertou!</span>':'<span style="color:#f87171;font-weight:600">❌ Você errou!</span>'}
      </div>`;
    updateMoedaStats();
  },1400);
}
function updateMoedaStats() {
  const prec=moeda.total?((moeda.acertos/moeda.total)*100).toFixed(1):0;
  document.getElementById('m-acertos').textContent=moeda.acertos;
  document.getElementById('m-total').textContent=moeda.total;
  document.getElementById('m-prec').textContent=prec+'%';
  document.getElementById('m-best').textContent=moeda.best;
  const hist=moeda.history.slice(0,10).map(g=>`<div class="history-item ${g.ok?'win':'lose'}">${g.guess} → ${g.result} ${g.ok?'✅':'❌'}</div>`).join('');
  document.getElementById('moeda-history').innerHTML=`<div class="history-panel mt-sm"><h4>📈 Últimos resultados</h4><div class="history-list">${hist}</div></div>`;
}
function resetMoeda() {
  moeda={total:0,acertos:0,streak:0,best:0,history:[]};
  document.getElementById('moeda-resultado').innerHTML='';
  document.getElementById('moeda-history').innerHTML='';
  ['m-acertos','m-total','m-best'].forEach(id=>document.getElementById(id).textContent='0');
  document.getElementById('m-prec').textContent='0%';
}

/* ======= DADOS ======= */
let dadosState = {pw:0,cw:0,ties:0,streak:0,best:0,history:[],mode:'single'};
function changeDiceMode(m,el) {
  dadosState.mode=m;
  document.querySelectorAll('.mode-pill').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}
function getDiceRolls() {
  const r=()=>Math.floor(Math.random()*6)+1;
  if(dadosState.mode==='double')return{player:r()+r(),cpu:r()+r()};
  if(dadosState.mode==='triple')return{player:r()+r()+r(),cpu:r()+r()+r()};
  return{player:r(),cpu:r()};
}
function rolarDados() {
  const {player,cpu}=getDiceRolls();
  let res;
  if(player>cpu){dadosState.pw++;dadosState.streak++;if(dadosState.streak>dadosState.best)dadosState.best=dadosState.streak;res='win';}
  else if(cpu>player){dadosState.cw++;dadosState.streak=0;res='lose';}
  else{dadosState.ties++;res='tie';}
  dadosState.history.unshift({player,cpu,result:res});
  if(dadosState.history.length>15)dadosState.history.pop();
  const msg={win:'🏆 VOCÊ VENCEU!',lose:'💻 CPU VENCEU!',tie:'🤝 EMPATE!'};
  document.getElementById('dados-resultado').innerHTML=`
    <div class="card"><div class="epic-battle">
      <div class="battle-arena">
        <div class="fighter player-fighter"><span class="dice-result-anim">🎲</span>${player}</div>
        <div class="battle-vs">⚔️</div>
        <div class="fighter cpu-fighter"><span class="dice-result-anim">🎲</span>${cpu}</div>
      </div>
      <div class="battle-result ${res}">${msg[res]}</div>
    </div></div>`;
  const tot=dadosState.pw+dadosState.cw+dadosState.ties;
  const wr=tot?((dadosState.pw/tot)*100).toFixed(1):0;
  document.getElementById('d-pw').textContent=dadosState.pw;
  document.getElementById('d-cw').textContent=dadosState.cw;
  document.getElementById('d-ties').textContent=dadosState.ties;
  document.getElementById('d-wr').textContent=wr+'%';
  document.getElementById('d-str').textContent=dadosState.streak;
  const hist=dadosState.history.map(h=>`<div class="history-item ${h.result}">🎲 ${h.player} vs ${h.cpu}</div>`).join('');
  document.getElementById('dados-history').innerHTML=`<div class="history-panel mt-sm"><h4>📜 Últimas rodadas</h4><div class="history-list">${hist}</div></div>`;
}
function resetDados() {
  dadosState={pw:0,cw:0,ties:0,streak:0,best:0,history:[],mode:dadosState.mode};
  document.getElementById('dados-resultado').innerHTML='';
  document.getElementById('dados-history').innerHTML='';
  ['d-pw','d-cw','d-ties','d-str'].forEach(id=>document.getElementById(id).textContent='0');
  document.getElementById('d-wr').textContent='0%';
}

/* ======= P1 LUZ ======= */
let lightOn=false,lightCount=0;
function toggleLight() {
  lightOn=!lightOn;
  const card=document.getElementById('lightCard');
  card.classList.toggle('lamp-on',lightOn);
  document.getElementById('lightBtn').textContent=lightOn?'Desligar':'Ligar';
  document.getElementById('lightStatus').textContent=lightOn?'● Ligada':'● Desligada';
  document.getElementById('lightStatus').className='light-status '+(lightOn?'status-on':'status-off');
  document.getElementById('lightState').textContent=lightOn?'ON':'OFF';
  if(lightOn){lightCount++;document.getElementById('lightCount').textContent=lightCount;}
  document.getElementById('lightTime').textContent=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
}

/* ======= P2 COFRE ======= */
let saldo=parseFloat(localStorage.getItem('cofreSaldo')||'0');
let counts=JSON.parse(localStorage.getItem('cofreCounts')||'{"10":0,"25":0,"50":0,"100":0}');
function fmtBRL(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function saveCofreLS(){localStorage.setItem('cofreSaldo',saldo.toString());localStorage.setItem('cofreCounts',JSON.stringify(counts));}
function updateCofreUI() {
  document.getElementById('totalDisplay').textContent=fmtBRL(saldo);
  document.getElementById('cnt10').textContent=counts['10'];
  document.getElementById('cnt25').textContent=counts['25'];
  document.getElementById('cnt50').textContent=counts['50'];
  document.getElementById('cnt100').textContent=counts['100'];
  const e=document.getElementById('cofreEmoji');
  e.textContent=saldo<2?'🐷':saldo<10?'💰':saldo<50?'🤑':'💎';
  saveCofreLS();
  const td=document.getElementById('totalDisplay');
  td.classList.add('bump');setTimeout(()=>td.classList.remove('bump'),300);
}
function addCoin(val) {
  saldo=Math.round((saldo+val)*100)/100;
  const k=Math.round(val*100).toString();
  counts[k]=(counts[k]||0)+1;
  const em=document.getElementById('cofreEmoji');
  em.classList.add('shake');setTimeout(()=>em.classList.remove('shake'),400);
  showAlertCofre('','');
  updateCofreUI();
}
function sacar() {
  const v=parseFloat(document.getElementById('saqueInput').value);
  if(!v||v<=0){showAlertCofre('error','Digite um valor válido!');return;}
  if(v>saldo){showAlertCofre('error','Você não tem Saldo para o saque!!');return;}
  saldo=Math.round((saldo-v)*100)/100;
  document.getElementById('saqueInput').value='';
  showAlertCofre('ok','Saque de '+fmtBRL(v)+' realizado! 💸');
  updateCofreUI();
}
function esvaziar() {
  saldo=0;counts={'10':0,'25':0,'50':0,'100':0};
  showAlertCofre('ok','Cofrinho esvaziado! 💪');
  updateCofreUI();
}
function showAlertCofre(type,msg) {
  const el=document.getElementById('alertMsg');
  if(!type){el.style.display='none';return;}
  el.textContent=msg;el.className='alert-msg '+(type==='error'?'alert-error':'alert-ok');
  el.style.display='block';clearTimeout(el._t);el._t=setTimeout(()=>el.style.display='none',3500);
}
updateCofreUI();

/* ======= P3 POMODORO ======= */
let pomCfg={foco:25,curta:5,longa:15,sessoes:4};
let pomMode='foco',pomSec=25*60,pomTotal=25*60,pomInt=null,pomRun=false,pomSess=0;
const CIRC=2*Math.PI*92;
function setMode(m) {
  pomMode=m;clearInterval(pomInt);pomRun=false;
  document.getElementById('startBtn').textContent='▶ Iniciar';
  pomSec=pomCfg[m]*60;pomTotal=pomSec;
  updateTimerUI();
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('mode'+m.charAt(0).toUpperCase()+m.slice(1)).classList.add('active');
  document.getElementById('timerModeName').textContent={foco:'FOCO',curta:'PAUSA CURTA',longa:'PAUSA LONGA'}[m];
}
function updateTimerUI() {
  const m=Math.floor(pomSec/60),s=pomSec%60;
  document.getElementById('timerDisplay').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  document.getElementById('timerProgress').style.strokeDashoffset=CIRC*(1-pomSec/pomTotal);
  const c=document.getElementById('sessionsCount');c.innerHTML='';
  for(let i=0;i<pomCfg.sessoes;i++){const d=document.createElement('div');d.className='dot'+(i<pomSess%pomCfg.sessoes?' done':'');c.appendChild(d);}
}
function startTimer() {
  if(pomRun)return;pomRun=true;document.getElementById('startBtn').textContent='⏸ Rodando…';
  pomInt=setInterval(()=>{pomSec--;updateTimerUI();if(pomSec<=0){clearInterval(pomInt);pomRun=false;document.getElementById('startBtn').textContent='▶ Iniciar';handlePomEnd();}},1000);
}
function pauseTimer(){clearInterval(pomInt);pomRun=false;document.getElementById('startBtn').textContent='▶ Iniciar';}
function resetTimer(){pauseTimer();pomSec=pomTotal;updateTimerUI();}
function handlePomEnd() {
  playBeep();
  if(pomMode==='foco'){pomSess++;updateTimerUI();const isLonga=pomSess%pomCfg.sessoes===0;setTimeout(()=>{if(confirm((isLonga?'🌙 Pausa longa!':'☕ Pausa curta!')+'  Iniciar agora?'))setMode(isLonga?'longa':'curta');},300);}
  else{setTimeout(()=>{if(confirm('🍅 Hora de focar! Iniciar novo Pomodoro?'))setMode('foco');},300);}
}
function playBeep() {
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();[0,0.3,0.6].forEach(d=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=880;o.type='sine';g.gain.setValueAtTime(0.3,ctx.currentTime+d);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d+0.25);o.start(ctx.currentTime+d);o.stop(ctx.currentTime+d+0.3);});}catch(e){}
}
function updateConfig() {
  pomCfg.foco=parseInt(document.getElementById('cfgFoco').value)||25;
  pomCfg.curta=parseInt(document.getElementById('cfgCurta').value)||5;
  pomCfg.longa=parseInt(document.getElementById('cfgLonga').value)||15;
  pomCfg.sessoes=parseInt(document.getElementById('cfgSessoes').value)||4;
  if(!pomRun)setMode(pomMode);
}
setMode('foco');

/* ======= P4 TECLADO ======= */
const ALL_NOTES=[
  {note:'Dó',freq:261.63,key:'A'},{note:'Ré',freq:293.66,key:'S'},{note:'Mi',freq:329.63,key:'D'},
  {note:'Fá',freq:349.23,key:'F'},{note:'Sol',freq:392.00,key:'G'},{note:'Lá',freq:440.00,key:'H'},
  {note:'Si',freq:493.88,key:'J'},{note:'Dó²',freq:523.25,key:'K'},{note:'Ré²',freq:587.33,key:'L'},
];
let audioCtx=null,recording=false,sequence=[],lastNoteTime=null;
function getAudioCtx(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();return audioCtx;}
function playNote(freq,keyEl) {
  try{const ctx=getAudioCtx();const osc=ctx.createOscillator();const gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.type='triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(0.4,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.2);osc.start(ctx.currentTime);osc.stop(ctx.currentTime+1.2);if(keyEl){keyEl.classList.add('active');setTimeout(()=>keyEl.classList.remove('active'),220);}}catch(e){}
}
function triggerNote(n,keyEl) {
  playNote(n.freq,keyEl);document.getElementById('lastNote').textContent=n.note+' ('+n.freq.toFixed(0)+' Hz)';
  if(recording){const now=Date.now();const gap=lastNoteTime?now-lastNoteTime:0;sequence.push({note:n.note,freq:n.freq,gap});lastNoteTime=now;renderSeq();}
}
function buildPiano() {
  const p=document.getElementById('piano');
  ALL_NOTES.forEach(n=>{const k=document.createElement('div');k.className='key white';k.dataset.key=n.key;k.dataset.freq=n.freq;k.innerHTML=`<span class="key-label">${n.note}</span><span class="key-shortcut">${n.key}</span>`;k.addEventListener('mousedown',()=>triggerNote(n,k));k.addEventListener('touchstart',e=>{e.preventDefault();triggerNote(n,k);});p.appendChild(k);});
}
function renderSeq(){const el=document.getElementById('seqDisplay');if(!sequence.length){el.innerHTML='Nenhuma nota ainda…';return;}el.innerHTML=sequence.map(s=>`<span class="seq-note">${s.note}</span>`).join('');}
function toggleRecord() {
  recording=!recording;const btn=document.getElementById('recordBtn');
  if(recording){sequence=[];lastNoteTime=null;btn.textContent='⏹ Parar';btn.style.background='rgba(239,68,68,0.15)';btn.style.borderColor='rgba(239,68,68,0.4)';btn.style.color='#fca5a5';renderSeq();}
  else{btn.textContent='⏺ Gravar';btn.style.background='';btn.style.borderColor='';btn.style.color='';}
}
function playSequence() {
  if(!sequence.length)return;let delay=0;
  sequence.forEach((item,i)=>{const gap=item.gap||(i===0?0:300);delay+=Math.min(gap,1000);setTimeout(()=>{const keyEl=document.querySelector(`.key[data-freq="${item.freq}"]`);playNote(item.freq,keyEl);},delay);});
}
function clearSeq(){sequence=[];lastNoteTime=null;renderSeq();}
buildPiano();
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;const k=e.key.toUpperCase();const n=ALL_NOTES.find(x=>x.key===k);if(n&&!e.repeat){const el=document.querySelector(`.key[data-key="${k}"]`);triggerNote(n,el);}});

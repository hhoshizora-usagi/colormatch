
(function(){

/* ─── Sound Effects (Web Audio API) ─── */
var sfxCtx;
function getSfxCtx(){
  if(!sfxCtx)sfxCtx=new (window.AudioContext||window.webkitAudioContext)();
  sfxCtx.resume().catch(function(){});
  return sfxCtx;
}

function sfxCorrect(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var osc=ctx.createOscillator(),g=ctx.createGain();
    var out=GameShell.audioOutput(ctx);
    osc.type='sine';osc.frequency.setValueAtTime(880,now);
    osc.frequency.exponentialRampToValueAtTime(1320,now+0.08);
    g.gain.setValueAtTime(0.18,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+0.15);
    osc.connect(g).connect(out);osc.start(now);osc.stop(now+0.15);
  }catch(e){}
}

function sfxWrong(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var osc=ctx.createOscillator(),g=ctx.createGain();
    var out=GameShell.audioOutput(ctx);
    osc.type='sawtooth';osc.frequency.setValueAtTime(220,now);
    osc.frequency.exponentialRampToValueAtTime(110,now+0.2);
    g.gain.setValueAtTime(0.12,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+0.25);
    osc.connect(g).connect(out);osc.start(now);osc.stop(now+0.25);
  }catch(e){}
}

function sfxTimeout(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var osc=ctx.createOscillator(),g=ctx.createGain();
    var out=GameShell.audioOutput(ctx);
    osc.type='square';osc.frequency.setValueAtTime(300,now);
    osc.frequency.linearRampToValueAtTime(100,now+0.3);
    g.gain.setValueAtTime(0.1,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+0.35);
    osc.connect(g).connect(out);osc.start(now);osc.stop(now+0.35);
  }catch(e){}
}

function sfxCombo(n){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var out=GameShell.audioOutput(ctx);
    var notes=[660,880,1100];
    for(var i=0;i<notes.length;i++){
      var osc=ctx.createOscillator(),g=ctx.createGain();
      osc.type='sine';osc.frequency.value=notes[i];
      var t=now+i*0.06;
      g.gain.setValueAtTime(0.12,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
      osc.connect(g).connect(out);osc.start(t);osc.stop(t+0.1);
    }
  }catch(e){}
}

function sfxTimerWarn(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var osc=ctx.createOscillator(),g=ctx.createGain();
    var out=GameShell.audioOutput(ctx);
    osc.type='sine';osc.frequency.value=1000;
    g.gain.setValueAtTime(0.06,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+0.05);
    osc.connect(g).connect(out);osc.start(now);osc.stop(now+0.05);
  }catch(e){}
}

function sfxGameOver(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var out=GameShell.audioOutput(ctx);
    var notes=[880,660,440,330];
    for(var i=0;i<notes.length;i++){
      var osc=ctx.createOscillator(),g=ctx.createGain();
      osc.type='sine';osc.frequency.value=notes[i];
      var t=now+i*0.12;
      g.gain.setValueAtTime(0.14,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
      osc.connect(g).connect(out);osc.start(t);osc.stop(t+0.2);
    }
  }catch(e){}
}

function sfxHighScore(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var out=GameShell.audioOutput(ctx);
    var notes=[523,659,784,1047,784,1047];
    for(var i=0;i<notes.length;i++){
      var osc=ctx.createOscillator(),g=ctx.createGain();
      osc.type='sine';osc.frequency.value=notes[i];
      var t=now+i*0.1;
      g.gain.setValueAtTime(0.15,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.15);
      osc.connect(g).connect(out);osc.start(t);osc.stop(t+0.15);
    }
  }catch(e){}
}

function sfxReverse(){
  try{
    var ctx=getSfxCtx(),now=ctx.currentTime;
    var out=GameShell.audioOutput(ctx);
    var osc=ctx.createOscillator(),g=ctx.createGain();
    osc.type='triangle';osc.frequency.setValueAtTime(440,now);
    osc.frequency.exponentialRampToValueAtTime(880,now+0.1);
    osc.frequency.exponentialRampToValueAtTime(440,now+0.2);
    g.gain.setValueAtTime(0.1,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+0.25);
    osc.connect(g).connect(out);osc.start(now);osc.stop(now+0.25);
  }catch(e){}
}


/* ─── Color Definitions ─── */
var COLORS_BASE=[
  {name:'あか',color:'#EF5350'},{name:'あお',color:'#42A5F5'},
  {name:'みどり',color:'#66BB6A'},{name:'きいろ',color:'#FFD740'},
  {name:'むらさき',color:'#AB47BC'},{name:'オレンジ',color:'#FF9800'},
  {name:'ピンク',color:'#FF80AB'},{name:'みずいろ',color:'#26C6DA'},
  {name:'ちゃいろ',color:'#8D6E63'}
];

// Extra similar/confusing colors for harder modes
var COLORS_HARD=[
  {name:'こいあお',color:'#1565C0'},{name:'うすみどり',color:'#A5D6A7'},
  {name:'サーモン',color:'#FF8A65'},{name:'くろ',color:'#424242'},
  {name:'きみどり',color:'#C0CA33'},{name:'あずき',color:'#AD1457'}
];

var COLORS;

/* ─── Difficulty Settings ─── */
var DIFF={
  normal:{
    totalRounds:20,
    baseTime:5000,timeDecay:100,minTime:2000,
    baseBtns:4,midBtns:5,lateBtns:6,
    stroopStart:3,stroopChance:0.4,
    reverseStart:999,reverseChance:0,
    btnStroopStart:999,btnStroopChance:0,
    extraColors:false,
    label:'ふつう'
  },
  hard:{
    totalRounds:25,
    baseTime:4000,timeDecay:120,minTime:1500,
    baseBtns:5,midBtns:6,lateBtns:7,
    stroopStart:1,stroopChance:0.6,
    reverseStart:8,reverseChance:0.25,
    btnStroopStart:5,btnStroopChance:0.5,
    extraColors:true,
    label:'🔥 むずい'
  },
  oni:{
    totalRounds:30,
    baseTime:3500,timeDecay:100,minTime:1200,
    baseBtns:6,midBtns:7,lateBtns:8,
    stroopStart:1,stroopChance:0.8,
    reverseStart:3,reverseChance:0.35,
    btnStroopStart:1,btnStroopChance:0.75,
    extraColors:true,
    label:'👹 おに'
  }
};

var currentDiff='normal';
var totalRounds,roundIdx,score,combo,maxCombo,correct,wrong,timer,timeLeft,maxTime,best,busy;
var timerWarnPlayed;
try{best=JSON.parse(localStorage.getItem('cm2'))||{};}catch(e){best={};}

function getEl(id){return document.getElementById(id);}
function showScreen(id){var s=document.querySelectorAll('.screen');for(var i=0;i<s.length;i++)s[i].classList.remove('active');getEl(id).classList.add('active');}
function shuffle(a){var b=a.slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=b[i];b[i]=b[j];b[j]=t;}return b;}

/* ─── Difficulty Selection ─── */
var diffBtns=document.querySelectorAll('.diff-btn');
for(var d=0;d<diffBtns.length;d++){
  diffBtns[d].addEventListener('click',function(){
    for(var k=0;k<diffBtns.length;k++)diffBtns[k].classList.remove('selected');
    this.classList.add('selected');
    currentDiff=this.getAttribute('data-diff');
  });
}

function startGame(){
  GameShell.beginRound();
  var cfg=DIFF[currentDiff];
  totalRounds=cfg.totalRounds;
  COLORS=cfg.extraColors?COLORS_BASE.concat(COLORS_HARD):COLORS_BASE.slice();
  roundIdx=0;score=0;combo=0;maxCombo=0;correct=0;wrong=0;busy=false;
  getEl('sc').textContent='0';
  getEl('totalR').textContent=totalRounds;
  var dl=getEl('diffLabel');
  dl.textContent=cfg.label;
  dl.className='diff-label '+currentDiff;
  showScreen('playScreen');
  nextRound();
}

function nextRound(){
  if(roundIdx>=totalRounds){showResult();return;}
  roundIdx++;busy=false;timerWarnPlayed=false;
  getEl('rnd').textContent=roundIdx;
  getEl('feedback').textContent='';

  var cfg=DIFF[currentDiff];

  // Determine if this is a "reverse" round
  var isReverse=roundIdx>=cfg.reverseStart&&Math.random()<cfg.reverseChance;
  var rtEl=getEl('roundType');
  var tc=getEl('targetColor');
  tc.classList.remove('reverse','shake');

  if(isReverse){
    rtEl.textContent='⚡ 文字の色名を読め！';
    rtEl.className='round-type reverse';
    sfxReverse();
    tc.classList.add('reverse');
  }else{
    rtEl.textContent='';
    rtEl.className='round-type';
  }

  // Pick target color
  var targetIdx=Math.floor(Math.random()*COLORS.length);
  var target=COLORS[targetIdx];

  if(isReverse){
    // REVERSE: target shows color NAME as text, but painted in a DIFFERENT color
    // Player must match the NAME (not the visual color)
    var fakeColorIdx;
    do{fakeColorIdx=Math.floor(Math.random()*COLORS.length);}while(fakeColorIdx===targetIdx);
    tc.style.background=COLORS[fakeColorIdx].color;
    tc.textContent=target.name;
    // The correct answer is still targetIdx (the NAME shown)
  }else{
    // Normal: show target color
    tc.style.background=target.color;

    // Stroop trick on target: sometimes show a DIFFERENT color name
    if(Math.random()<cfg.stroopChance&&roundIdx>=cfg.stroopStart){
      var fakeIdx;
      do{fakeIdx=Math.floor(Math.random()*COLORS.length);}while(fakeIdx===targetIdx);
      tc.textContent=COLORS[fakeIdx].name;
    }else{
      tc.textContent='この色！';
    }
  }

  // Pick button count
  var btnCount;
  if(roundIdx<=5)btnCount=cfg.baseBtns;
  else if(roundIdx<=Math.floor(totalRounds*0.6))btnCount=cfg.midBtns;
  else btnCount=cfg.lateBtns;

  // Always include correct one
  var options=[target];
  var pool=shuffle(COLORS.filter(function(c){return c!==target;}));
  for(var i=0;i<btnCount-1&&i<pool.length;i++)options.push(pool[i]);
  options=shuffle(options);

  var html='';
  for(var i=0;i<options.length;i++){
    // Button Stroop: sometimes show wrong name on button
    var btnLabel=options[i].name;
    if(roundIdx>=cfg.btnStroopStart&&Math.random()<cfg.btnStroopChance){
      var wrongNameIdx;
      do{wrongNameIdx=Math.floor(Math.random()*COLORS.length);}
      while(COLORS[wrongNameIdx]===options[i]);
      btnLabel=COLORS[wrongNameIdx].name;
    }
    html+='<button class="cbtn" data-i="'+COLORS.indexOf(options[i])+'" style="background:'+options[i].color+'">'+btnLabel+'</button>';
  }
  getEl('colorBtns').innerHTML=html;

  var btns=document.querySelectorAll('.cbtn');
  for(var i=0;i<btns.length;i++){
    btns[i].addEventListener('click',function(){
      if(busy)return;
      onTap(this,targetIdx,isReverse);
    });
  }

  // Timer
  maxTime=Math.max(cfg.minTime,cfg.baseTime-roundIdx*cfg.timeDecay);
  timeLeft=maxTime;
  clearInterval(timer);
  var fill=getEl('timerFill');
  fill.style.width='100%';
  fill.className='timer-fill';
  timer=setInterval(function(){
    timeLeft-=50;
    var pct=Math.max(0,timeLeft/maxTime*100);
    fill.style.width=pct+'%';

    // Timer color warnings
    if(pct<=25){
      fill.className='timer-fill danger';
      if(!timerWarnPlayed){timerWarnPlayed=true;sfxTimerWarn();}
    }else if(pct<=50){
      fill.className='timer-fill warn';
    }

    if(timeLeft<=0){
      clearInterval(timer);busy=true;wrong++;combo=0;
      sfxTimeout();
      getEl('feedback').textContent='⏰ じかんぎれ〜！';
      getEl('feedback').style.color='#FF5252';
      getEl('streak').textContent='';
      tc.classList.add('shake');
      var btns=document.querySelectorAll('.cbtn');
      for(var i=0;i<btns.length;i++){
        if(parseInt(btns[i].getAttribute('data-i'))===targetIdx)btns[i].classList.add('correct');
      }
      setTimeout(nextRound,1200);
    }
  },50);
}

function onTap(el,targetIdx,isReverse){
  busy=true;
  clearInterval(timer);
  var tapped=parseInt(el.getAttribute('data-i'));

  if(tapped===targetIdx){
    el.classList.add('correct','pop');
    sfxCorrect();
    correct++;combo++;if(combo>maxCombo)maxCombo=combo;
    var speedBonus=Math.floor(timeLeft/maxTime*40);
    var comboBonus=combo*3;
    var reverseBonus=isReverse?15:0;
    var pts=10+speedBonus+comboBonus+reverseBonus;
    score+=pts;
    getEl('sc').textContent=score;
    var bonusText=isReverse?' (逆+'+reverseBonus+')':'';
    getEl('feedback').textContent='⭕ +'+pts+bonusText;
    getEl('feedback').style.color='#4CAF50';
    if(combo>=3){
      getEl('streak').textContent='🔥 '+combo+'連続正解！';
      if(combo%5===0)sfxCombo(combo);
    }
  }else{
    el.classList.add('wrong');
    sfxWrong();
    wrong++;combo=0;
    getEl('feedback').textContent='❌ ちがう〜！';
    getEl('feedback').style.color='#FF5252';
    getEl('streak').textContent='';
    var tc=getEl('targetColor');
    tc.classList.add('shake');
    var btns=document.querySelectorAll('.cbtn');
    for(var i=0;i<btns.length;i++){
      if(parseInt(btns[i].getAttribute('data-i'))===targetIdx)btns[i].classList.add('correct');
    }
  }
  setTimeout(nextRound,1000);
}

function showResult(){
  clearInterval(timer);
  var bestKey=currentDiff;
  var prevBest=best[bestKey]||0;
  var isNewBest=score>prevBest;
  if(isNewBest){best[bestKey]=score;try{localStorage.setItem('cm2',JSON.stringify(best));}catch(e){}}

  if(isNewBest&&score>0)sfxHighScore();
  else sfxGameOver();

  showScreen('resultScreen');
  var pct=correct/totalRounds;
  if(pct>=0.9){getEl('rTitle').textContent='🎉 すご〜い！';getEl('rTitle').style.color='#FFD740';getEl('rEmoji').textContent='🎨✨';}
  else if(pct>=0.7){getEl('rTitle').textContent='✨ いいかんじ！';getEl('rTitle').style.color='#7B1FA2';getEl('rEmoji').textContent='🎨💕';}
  else{getEl('rTitle').textContent='💪 がんばろ〜！';getEl('rTitle').style.color='#999';getEl('rEmoji').textContent='🎨💪';}

  var scoreText=score+'てん！';
  if(isNewBest&&score>0)scoreText+=' 🏆 ハイスコア！！';
  getEl('rScore').textContent=scoreText;
  getEl('rStats').textContent='正解: '+correct+' / まちがい: '+wrong+' / 最大連続: '+maxCombo;
  getEl('rBest').textContent='🏆 ベスト: '+(best[bestKey]||0)+'てん（'+DIFF[currentDiff].label+'）';
}

getEl('startBtn').addEventListener('click',startGame);
getEl('retryBtn').addEventListener('click',startGame);
})();

(function(){function decorate(){document.querySelectorAll(".num,.pad,.cbtn,.box,.big-btn,.target").forEach(el=>{if(el.hasAttribute("tabindex")||el.tagName==="BUTTON")return;el.tabIndex=0;el.setAttribute("role","button");el.addEventListener("keydown",e=>{if((e.code==="Enter"||e.code==="Space")&&!e.repeat){e.preventDefault();el.click();}});});}decorate();new MutationObserver(decorate).observe(document.getElementById("g"),{subtree:true,childList:true});})();

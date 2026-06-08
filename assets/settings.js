/* Harinivash Studio — on-site settings panel (self-injecting) */
(function(){
  var STORE = 'hs_settings';
  var ACCENTS = [
    { id:'blue',   acc:'#4C7DF0', hi:'#6E97F4', lo:'#3A63C8' },
    { id:'violet', acc:'#7c5af0', hi:'#9a7ff5', lo:'#5e3fcf' },
    { id:'green',  acc:'#19b88a', hi:'#3fd0a4', lo:'#12916c' },
    { id:'amber',  acc:'#e0922f', hi:'#f0ad53', lo:'#bd751c' },
    { id:'rose',   acc:'#e0556f', hi:'#f07a90', lo:'#bd3d54' },
    { id:'cyan',   acc:'#2bb6d6', hi:'#54cce8', lo:'#1d8fab' }
  ];
  function hexA(hex, a){ var n=parseInt(hex.slice(1),16); return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'; }

  function load(){ try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch(e){ return {}; } }
  function save(s){ try { localStorage.setItem(STORE, JSON.stringify(s)); } catch(e){} }

  var s = load();
  // theme already applied by inline script; sync with existing localStorage 'theme'
  if (!s.theme) s.theme = localStorage.getItem('theme') || 'dark';
  if (!s.accent) s.accent = 'blue';

  function applyAccent(id){
    var a = ACCENTS.filter(function(x){return x.id===id;})[0] || ACCENTS[0];
    var r = document.documentElement.style;
    r.setProperty('--acc', a.acc); r.setProperty('--acc-hi', a.hi); r.setProperty('--acc-lo', a.lo);
    r.setProperty('--acc-w', hexA(a.acc, 0.08)); r.setProperty('--acc-b', hexA(a.acc, 0.30));
  }
  function applyTheme(t){ document.documentElement.classList.toggle('light', t==='light'); localStorage.setItem('theme', t); }
  function applyMotion(on){ document.documentElement.classList.toggle('reduce-motion', !!on); }
  function applyCursor(off){ document.documentElement.classList.toggle('no-cursor', !!off); }

  // apply saved on load
  applyAccent(s.accent);
  if (s.reduceMotion) applyMotion(true);
  if (s.noCursor) applyCursor(true);

  // build UI
  function swatchHTML(){ return ACCENTS.map(function(a){ return '<button class="swatch'+(a.id===s.accent?' active':'')+'" data-accent="'+a.id+'" style="background:linear-gradient(180deg,'+a.hi+','+a.lo+')" aria-label="'+a.id+' accent"></button>'; }).join(''); }
  var btn = document.createElement('button');
  btn.className = 'settings-btn'; btn.id = 'settingsBtn'; btn.setAttribute('aria-label','Open settings');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';

  var ov = document.createElement('div'); ov.className='settings-overlay'; ov.id='settingsOverlay';
  var panel = document.createElement('aside'); panel.className='settings-panel'; panel.id='settingsPanel'; panel.setAttribute('aria-label','Site settings');
  panel.innerHTML =
    '<div class="settings-head"><h3>Settings</h3><button class="settings-close" id="settingsClose" aria-label="Close">&times;</button></div>'+
    '<p class="settings-sub">Make the site yours. Saved to this browser.</p>'+
    '<div class="set-row"><span class="set-label">Theme</span><div class="seg" id="setTheme"><button data-theme="dark"'+(s.theme==='dark'?' class="active"':'')+'>Dark</button><button data-theme="light"'+(s.theme==='light'?' class="active"':'')+'>Light</button></div></div>'+
    '<div class="set-row"><span class="set-label">Accent color</span><div class="swatches" id="setAccent">'+swatchHTML()+'</div></div>'+
    '<div class="set-row set-toggle"><span>Reduce motion</span><button class="tgl'+(s.reduceMotion?' on':'')+'" id="setMotion" role="switch" aria-checked="'+(!!s.reduceMotion)+'" aria-label="Reduce motion"></button></div>'+
    '<div class="set-row set-toggle"><span>Custom cursor</span><button class="tgl'+(s.noCursor?'':' on')+'" id="setCursor" role="switch" aria-checked="'+(!s.noCursor)+'" aria-label="Custom cursor"></button></div>'+
    '<button class="settings-reset" id="setReset">Reset to defaults</button>';

  document.body.appendChild(btn); document.body.appendChild(ov); document.body.appendChild(panel);

  function open(){ ov.classList.add('open'); panel.classList.add('open'); }
  function close(){ ov.classList.remove('open'); panel.classList.remove('open'); }
  btn.addEventListener('click', open);
  ov.addEventListener('click', close);
  document.getElementById('settingsClose').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });

  // theme seg
  document.getElementById('setTheme').addEventListener('click', function(e){
    var b=e.target.closest('button'); if(!b) return;
    s.theme=b.getAttribute('data-theme'); applyTheme(s.theme); save(s);
    this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active', x===b);});
  });
  // accent
  document.getElementById('setAccent').addEventListener('click', function(e){
    var b=e.target.closest('.swatch'); if(!b) return;
    s.accent=b.getAttribute('data-accent'); applyAccent(s.accent); save(s);
    this.querySelectorAll('.swatch').forEach(function(x){x.classList.toggle('active', x===b);});
  });
  // motion
  document.getElementById('setMotion').addEventListener('click', function(){
    s.reduceMotion=!s.reduceMotion; applyMotion(s.reduceMotion); this.classList.toggle('on', s.reduceMotion); this.setAttribute('aria-checked', s.reduceMotion); save(s);
  });
  // cursor (toggle ON = custom cursor visible; storing noCursor inverse)
  document.getElementById('setCursor').addEventListener('click', function(){
    s.noCursor=!s.noCursor; applyCursor(s.noCursor); this.classList.toggle('on', !s.noCursor); this.setAttribute('aria-checked', !s.noCursor); save(s);
  });
  // reset
  document.getElementById('setReset').addEventListener('click', function(){
    s={theme:'dark',accent:'blue',reduceMotion:false,noCursor:false}; save(s);
    applyTheme('dark'); applyAccent('blue'); applyMotion(false); applyCursor(false);
    close(); setTimeout(function(){ location.reload(); }, 150);
  });

  // keep settings theme in sync if nav switch is used
  var navToggle=document.getElementById('themeToggle');
  if(navToggle) navToggle.addEventListener('click', function(){ setTimeout(function(){ s.theme=document.documentElement.classList.contains('light')?'light':'dark'; save(s); var seg=document.getElementById('setTheme'); if(seg) seg.querySelectorAll('button').forEach(function(x){x.classList.toggle('active', x.getAttribute('data-theme')===s.theme);}); }, 50); });
})();

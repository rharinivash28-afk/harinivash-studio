/* Harinivash Studio — on-site settings panel (self-injecting, full-theme color) */
(function(){
  var STORE = 'hs_settings';
  // Each theme color retints the WHOLE site: accent + background hue + glow.
  var COLORS = [
    { id:'blue',   acc:'#4C7DF0', hi:'#6E97F4', lo:'#3A63C8', vio:'#7c5af0' },
    { id:'violet', acc:'#7c5af0', hi:'#9a7ff5', lo:'#5e3fcf', vio:'#b06cf5' },
    { id:'green',  acc:'#19b88a', hi:'#3fd0a4', lo:'#12916c', vio:'#36c2a8' },
    { id:'amber',  acc:'#e0922f', hi:'#f0ad53', lo:'#bd751c', vio:'#e0b34f' },
    { id:'rose',   acc:'#e0556f', hi:'#f07a90', lo:'#bd3d54', vio:'#f078a8' },
    { id:'cyan',   acc:'#2bb6d6', hi:'#54cce8', lo:'#1d8fab', vio:'#4fc6e0' },
    { id:'crimson',acc:'#e23b54', hi:'#f0607a', lo:'#bd2840', vio:'#f05a86' },
    { id:'lime',   acc:'#7bbf3a', hi:'#9bd45e', lo:'#5e9a26', vio:'#a6d36c' }
  ];
  var FONTS = { sm:0.92, md:1, lg:1.12 };

  function rgb(hex){ var n=parseInt(hex.slice(1),16); return [n>>16&255, n>>8&255, n&255]; }
  function rgba(hex,a){ var c=rgb(hex); return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }

  function load(){ try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch(e){ return {}; } }
  function save(st){ try { localStorage.setItem(STORE, JSON.stringify(st)); } catch(e){} }

  var s = load();
  if (!s.theme)  s.theme  = localStorage.getItem('theme') || 'dark';
  if (!s.accent) s.accent = 'blue';
  if (!s.font)   s.font   = 'md';
  if (typeof s.animBg === 'undefined') s.animBg = true;

  function applyColor(id){
    var c = COLORS.filter(function(x){return x.id===id;})[0] || COLORS[0];
    var r = document.documentElement.style;
    r.setProperty('--acc', c.acc); r.setProperty('--acc-hi', c.hi); r.setProperty('--acc-lo', c.lo); r.setProperty('--vio', c.vio);
    r.setProperty('--acc-w', rgba(c.acc, 0.08)); r.setProperty('--acc-b', rgba(c.acc, 0.30));
    // whole-site tint: recolour the fixed gradient-mesh background to this hue
    var mesh =
      'radial-gradient(60% 50% at 12% 8%, '+rgba(c.acc,0.18)+' 0%, transparent 60%),'+
      'radial-gradient(55% 45% at 88% 18%, '+rgba(c.vio,0.14)+' 0%, transparent 62%),'+
      'radial-gradient(50% 50% at 78% 92%, '+rgba(c.acc,0.12)+' 0%, transparent 60%),'+
      'radial-gradient(45% 45% at 22% 88%, '+rgba(c.hi,0.09)+' 0%, transparent 62%)';
    r.setProperty('--site-mesh', mesh);
    document.documentElement.setAttribute('data-tint', id);
  }
  function applyTheme(t){ document.documentElement.classList.toggle('light', t==='light'); localStorage.setItem('theme', t); }
  function applyFont(f){ document.documentElement.style.setProperty('--ui-scale', FONTS[f] || FONTS.md); document.documentElement.setAttribute('data-font', f); }
  function applyCursor(off){ document.documentElement.classList.toggle('no-cursor', !!off); }
  function applyAnimBg(on){ document.documentElement.classList.toggle('static-bg', !on); }

  // apply saved
  applyColor(s.accent); applyFont(s.font);
  if (s.noCursor) applyCursor(true);
  if (!s.animBg) applyAnimBg(false);

  // ── UI ──
  function swatches(){ return COLORS.map(function(c){ return '<button class="swatch'+(c.id===s.accent?' active':'')+'" data-color="'+c.id+'" style="background:linear-gradient(180deg,'+c.hi+','+c.lo+')" aria-label="'+c.id+' theme"></button>'; }).join(''); }

  var btn = document.createElement('button');
  btn.className='settings-btn'; btn.id='settingsBtn'; btn.setAttribute('aria-label','Open settings');
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';

  var ov = document.createElement('div'); ov.className='settings-overlay'; ov.id='settingsOverlay';
  var panel = document.createElement('aside'); panel.className='settings-panel'; panel.id='settingsPanel'; panel.setAttribute('aria-label','Site settings');
  panel.innerHTML =
    '<div class="settings-head"><h3>Settings</h3><button class="settings-close" id="settingsClose" aria-label="Close">&times;</button></div>'+
    '<p class="settings-sub">Personalise the whole site. Saved to this browser.</p>'+
    '<div class="set-row"><span class="set-label">Appearance</span><div class="seg" id="setTheme"><button data-theme="dark"'+(s.theme==='dark'?' class="active"':'')+'>Dark</button><button data-theme="light"'+(s.theme==='light'?' class="active"':'')+'>Light</button></div></div>'+
    '<div class="set-row"><span class="set-label">Theme color</span><div class="swatches" id="setColor">'+swatches()+'</div></div>'+
    '<div class="set-row"><span class="set-label">Text size</span><div class="seg" id="setFont"><button data-font="sm"'+(s.font==='sm'?' class="active"':'')+'>A</button><button data-font="md"'+(s.font==='md'?' class="active"':'')+'>A</button><button data-font="lg"'+(s.font==='lg'?' class="active"':'')+'>A</button></div></div>'+
    '<div class="set-row set-toggle"><span>Animated background</span><button class="tgl'+(s.animBg?' on':'')+'" id="setAnimBg" role="switch" aria-checked="'+(!!s.animBg)+'"></button></div>'+
    '<div class="set-row set-toggle"><span>Custom cursor</span><button class="tgl'+(s.noCursor?'':' on')+'" id="setCursor" role="switch" aria-checked="'+(!s.noCursor)+'"></button></div>'+
    '<button class="settings-reset" id="setReset">Reset to defaults</button>';
  // mark the three text-size buttons visually small/med/large
  panel.querySelectorAll('#setFont button')[0].style.fontSize='12px';
  panel.querySelectorAll('#setFont button')[2].style.fontSize='18px';

  document.body.appendChild(btn); document.body.appendChild(ov); document.body.appendChild(panel);

  function open(){ ov.classList.add('open'); panel.classList.add('open'); }
  function close(){ ov.classList.remove('open'); panel.classList.remove('open'); }
  btn.addEventListener('click', open);
  ov.addEventListener('click', close);
  document.getElementById('settingsClose').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });

  document.getElementById('setTheme').addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b)return; s.theme=b.dataset.theme; applyTheme(s.theme); save(s); this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x===b);}); });
  document.getElementById('setColor').addEventListener('click', function(e){ var b=e.target.closest('.swatch'); if(!b)return; s.accent=b.dataset.color; applyColor(s.accent); save(s); this.querySelectorAll('.swatch').forEach(function(x){x.classList.toggle('active',x===b);}); });
  document.getElementById('setFont').addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b)return; s.font=b.dataset.font; applyFont(s.font); save(s); this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x===b);}); });
  document.getElementById('setAnimBg').addEventListener('click', function(){ s.animBg=!s.animBg; applyAnimBg(s.animBg); this.classList.toggle('on',s.animBg); this.setAttribute('aria-checked',s.animBg); save(s); });
  document.getElementById('setCursor').addEventListener('click', function(){ s.noCursor=!s.noCursor; applyCursor(s.noCursor); this.classList.toggle('on',!s.noCursor); this.setAttribute('aria-checked',!s.noCursor); save(s); });
  document.getElementById('setReset').addEventListener('click', function(){ s={theme:'dark',accent:'blue',font:'md',animBg:true,noCursor:false}; save(s); applyTheme('dark'); applyColor('blue'); applyFont('md'); applyAnimBg(true); applyCursor(false); close(); setTimeout(function(){location.reload();},150); });

  // sync with nav theme switch
  var navToggle=document.getElementById('themeToggle');
  if(navToggle) navToggle.addEventListener('click', function(){ setTimeout(function(){ s.theme=document.documentElement.classList.contains('light')?'light':'dark'; save(s); var seg=document.getElementById('setTheme'); if(seg) seg.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x.dataset.theme===s.theme);}); },50); });
})();

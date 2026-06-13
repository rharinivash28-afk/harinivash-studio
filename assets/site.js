/* Harinivash Studio — shared subpage behaviour */
(function(){
  // theme (apply before paint already handled inline; this keeps toggle in sync)
  var saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") document.documentElement.classList.add("light");
  var tt = document.getElementById("themeToggle");
  if (tt) tt.addEventListener("click", function(){
    var isLight = document.documentElement.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // nav scroll -> rounded glossy pill + progress bar + living background
  var nav = document.getElementById("nav");
  var bar = document.getElementById("scrollBar");
  var root = document.documentElement;
  var maxScroll = 1, ticking = false;
  function measure(){ maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
  function update(){
    ticking = false;
    var y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 24);
    var p = y / maxScroll;
    if (bar) bar.style.width = (p * 100) + "%";
    root.style.setProperty("--bg-shift", (p * -70).toFixed(1) + "px");
    root.style.setProperty("--bg-hue", (p * 55).toFixed(1) + "deg");
    root.style.setProperty("--bg-sat", (1 + p * 0.12).toFixed(2));
  }
  window.addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  measure(); update();

  // mobile menu
  var ham = document.getElementById("hamburger");
  var mob = document.getElementById("mob");
  var mobClose = document.getElementById("mobClose");
  if (ham && mob) ham.addEventListener("click", function(){ mob.classList.add("open"); });
  if (mobClose && mob) mobClose.addEventListener("click", function(){ mob.classList.remove("open"); });

  // nav "More" dropdown
  var dd = document.getElementById("navDd"), ddBtn = document.getElementById("navDdBtn");
  if (dd && ddBtn){
    ddBtn.addEventListener("click", function(e){ e.stopPropagation(); var open = dd.classList.toggle("open"); ddBtn.setAttribute("aria-expanded", open ? "true" : "false"); });
    document.addEventListener("click", function(e){ if (!dd.contains(e.target)){ dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded","false"); } });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape"){ dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded","false"); } });
  }

  // scroll reveal (with fallback for browsers without IntersectionObserver)
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("on"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("on"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
  }

  // methodology: cycle "active" through the workflow nodes like a running flow
  (function(){
    var nodes = document.querySelectorAll(".flow-node");
    if (!nodes.length) return;
    var i = 0;
    function step(){
      nodes.forEach(function(n){ n.classList.remove("active"); });
      nodes[i].classList.add("active");
      i = (i + 1) % nodes.length;
    }
    step();
    setInterval(step, 1400);
  })();
  // stagger grid children
  document.querySelectorAll(".card-grid").forEach(function(grid){
    Array.prototype.forEach.call(grid.children, function(child, i){
      if (child.classList.contains("reveal")) child.style.transitionDelay = (i % 3) * 0.08 + "s";
    });
  });

  // copy email (link or button)
  function fallbackCopy(t){ var ta=document.createElement("textarea"); ta.value=t; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch(e){} ta.remove(); }
  var toastEl;
  function toast(msg){ if(!toastEl){toastEl=document.createElement("div"); toastEl.className="copy-toast"; document.body.appendChild(toastEl);} toastEl.innerHTML='<span class="ct-check">&#10003;</span>'+msg; toastEl.classList.add("show"); clearTimeout(toastEl._t); toastEl._t=setTimeout(function(){toastEl.classList.remove("show");},2200); }
  document.querySelectorAll(".copy-email").forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      var email = el.getAttribute("data-email");
      var done = function(){ toast("Email copied to clipboard"); if(el.classList.contains("copy-btn")){ el.classList.add("copied"); setTimeout(function(){el.classList.remove("copied");},1600);} };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done).catch(function(){fallbackCopy(email);done();});
      else { fallbackCopy(email); done(); }
    });
  });

  // copy discord username
  document.querySelectorAll(".copy-discord").forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      var handle = el.getAttribute("data-discord");
      var done = function(){ toast("Discord username copied to clipboard"); el.classList.add("copied"); setTimeout(function(){el.classList.remove("copied");},1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(handle).then(done).catch(function(){fallbackCopy(handle);done();});
      else { fallbackCopy(handle); done(); }
    });
  });

  // custom glossy arrow cursor
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches){
    var c = document.createElement("div"); c.className = "cursor-arrow";
    function paintCursor(){
      var cs = getComputedStyle(document.documentElement);
      var hi=(cs.getPropertyValue('--acc-hi')||'#6E97F4').trim(), acc=(cs.getPropertyValue('--acc')||'#4C7DF0').trim(), lo=(cs.getPropertyValue('--acc-lo')||'#3A63C8').trim(), vio=(cs.getPropertyValue('--vio')||'#7c5af0').trim();
      c.innerHTML = '<svg viewBox="0 0 24 28" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="caG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="'+hi+'"/><stop offset="1" stop-color="'+lo+'"/></linearGradient></defs><path d="M3 2 L3 23 L9 18 L12.5 26 L16 24.5 L12.5 16.5 L20 16.5 Z" fill="url(#caG)" stroke="'+acc+'" stroke-width="1.4" stroke-linejoin="round"/><path d="M4.4 4 L4.4 16 L8 13 Z" fill="rgba(255,255,255,0.55)"/><rect x="15.6" y="22.4" width="5" height="5" rx="1" transform="rotate(45 18.1 24.9)" fill="'+vio+'" stroke="'+lo+'" stroke-width="0.8"/></svg>';
    }
    paintCursor();
    new MutationObserver(paintCursor).observe(document.documentElement, { attributes:true, attributeFilter:['data-tint','class'] });
    document.body.appendChild(c);
    var raf;
    document.addEventListener("mousemove", function(e){ var x=e.clientX, y=e.clientY; cancelAnimationFrame(raf); raf=requestAnimationFrame(function(){ c.style.transform="translate("+(x-2)+"px,"+(y-1)+"px)"; }); });
    document.addEventListener("mousedown", function(){ document.body.classList.add("cur-press"); });
    document.addEventListener("mouseup", function(){ document.body.classList.remove("cur-press"); });
    document.addEventListener("mouseleave", function(){ c.style.opacity="0"; });
    document.addEventListener("mouseenter", function(){ c.style.opacity="1"; });
  }

  // Cal.com booking popup — lazy-loaded only on first click (no third-party
  // cookies / scripts on initial page load → better perf & best-practices)
  var calReady = false;
  function loadCal(){
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var ns = ar[1]; api.q = api.q || []; if(typeof ns === "string"){cal.ns[ns]=cal.ns[ns]||api;p(cal.ns[ns],ar);p(cal,["initNamespace",ns]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", "discovery", { origin: "https://cal.com" });
    Cal.ns.discovery("ui", { theme: "dark", cssVarsPerTheme: { light: { "cal-brand": "#4C7DF0" }, dark: { "cal-brand": "#4C7DF0" } }, hideEventTypeDetails: false, layout: "month_view" });
    calReady = true;
  }
  function openCal(){ Cal.ns.discovery("modal", { calLink: "harinivash-r-du3qxx/discovery", config: { theme: "dark", name: "", email: "" } }); }
  document.querySelectorAll('[data-cal-link]').forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      if (!calReady){ loadCal(); }
      // Cal's snippet queues calls, so openCal runs as soon as embed.js is ready
      openCal();
    });
  });
})();

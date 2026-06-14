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

  // Cal.com booking popup — lazy-loaded only on first click (no third-party
  // cookies / scripts on initial page load → better perf & best-practices)
  var CAL_URL = "https://cal.com/harinivash-r-du3qxx/discovery";
  var calReady = false, calOk = false;
  function loadCal(){
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var ns = ar[1]; api.q = api.q || []; if(typeof ns === "string"){cal.ns[ns]=cal.ns[ns]||api;p(cal.ns[ns],ar);p(cal,["initNamespace",ns]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", "discovery", { origin: "https://cal.com" });
    Cal.ns.discovery("ui", { theme: "dark", cssVarsPerTheme: { light: { "cal-brand": "#4C7DF0" }, dark: { "cal-brand": "#4C7DF0" } }, hideEventTypeDetails: false, layout: "month_view" });
    // track whether the embed script actually loaded — if a blocker/network kills
    // it, we fall back to the booking page so the button is never dead
    var sc = document.querySelector('script[src*="app.cal.com/embed/embed.js"]');
    if (sc){ sc.addEventListener("load", function(){ calOk = true; }); sc.addEventListener("error", function(){ calOk = false; }); }
    calReady = true;
  }
  function openCal(){ try { Cal.ns.discovery("modal", { calLink: "harinivash-r-du3qxx/discovery", config: { theme: "dark", name: "", email: "" } }); } catch(e){} }
  document.querySelectorAll('[data-cal-link]').forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      if (!calReady){ loadCal(); }
      // Cal's snippet queues calls, so openCal runs as soon as embed.js is ready
      openCal();
      // fallback: if the Cal embed never loaded (ad-blocker, offline, slow network),
      // send the visitor to the real booking page so "Book a call" always works
      var href = el.getAttribute("href") || CAL_URL;
      setTimeout(function(){ if (!calOk){ window.location.href = href; } }, 2500);
    });
  });
})();

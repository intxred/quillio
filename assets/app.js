/* Quillio website behaviour. No dependencies. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CFG = window.SITE || {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- mascots ---------- */
  var hero = AHMascot.create($("#heroMascot"), {
    sleepy: true, label: "Hedgehog mascot. Press to say hi.",
    onPoke: function () { var h = $("#stageHint"); if (h) h.classList.add("gone"); }
  });
  var tryM = AHMascot.create($("#tryMascot"), { label: "Hedgehog. Reacts to your answers.", lines: ["Take your time. There's no timer.", "You can do this!", "I'm rooting for you."] });
  var mini = AHMascot.create($("#miniMascot"), {
    label: "Hedgehog helper. Press for a tip.",
    lines: ["Need setup help? See the Setup section.", "Parents run everything from the dashboard.", "Pass the exam, then press the Open button.", "Questions? There's a Contact form at the bottom."],
    onPoke: function () { if (!reduce) mini.host.parentNode.style.transform = ""; }
  });
  ["brandMark", "footMark"].forEach(function (id) {
    var n = document.getElementById(id);
    if (n) n.innerHTML = AHMascot.svg({ still: true, viewBox: "40 30 180 170" });
  });
  /* hero mascot greets you, once the page has settled */
  setTimeout(function () { hero.say("Hi! Poke me.", 2800); hero.jump(); }, 1400);

  /* ---------- toast ---------- */
  var toastT = 0;
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, 2600);
  }

  /* ---------- OS detection ---------- */
  var ua = navigator.userAgent || "", plat = navigator.platform || "";
  var os = /iPhone|iPad|iPod|Android/i.test(ua) ? "other" : /Mac/i.test(plat + ua) ? "mac" : /Win/i.test(plat + ua) ? "win" : "other";
  var label = os === "mac" ? "Download for Mac" : os === "win" ? "Download for Windows" : "Download";
  $$("[data-dl-label]").forEach(function (n) { n.textContent = n.classList.contains("nav-cta") ? "Download" : label; });
  if (os === "other") $("#heroFine").textContent = "Install it on a Mac or Windows computer. Free. Works offline. No account.";
  if (os === "win") $("#heroFine").textContent = "Windows version is in Beta. Free. Works offline. No account.";

  /* ---------- ripple ---------- */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".btn"); if (!b || reduce) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement("span");
    d.className = "ripple"; d.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    b.appendChild(d); setTimeout(function () { d.remove(); }, 650);
  });

  /* ---------- nav: sliding highlight + scroll spy + sheet ---------- */
  var navUL = $("#navlinks"), ink = $(".nav-ink"), links = $$("a[data-nav]", navUL), activeId = "";
  function moveInk(a) {
    if (!a) { ink.classList.remove("show"); return; }
    ink.style.width = a.offsetWidth + "px";
    ink.style.transform = "translateX(" + a.offsetLeft + "px)";
    ink.classList.add("show");
  }
  function setActive(id) {
    activeId = id;
    links.forEach(function (a) { var on = a.dataset.nav === id; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    moveInk(links.filter(function (a) { return a.dataset.nav === id; })[0]);
  }
  links.forEach(function (a) {
    a.addEventListener("pointerenter", function () { moveInk(a); links.forEach(function (x) { x.classList.toggle("hov", x === a); }); });
  });
  navUL.addEventListener("pointerleave", function () { moveInk(links.filter(function (a) { return a.dataset.nav === activeId; })[0]); });
  addEventListener("resize", function () { moveInk(links.filter(function (a) { return a.dataset.nav === activeId; })[0]); });

  var burger = $("#burger"), sheet = $("#sheet");
  function toggleSheet(open) {
    burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    sheet.hidden = !open;
  }
  burger.addEventListener("click", function () { toggleSheet(burger.getAttribute("aria-expanded") !== "true"); });
  sheet.addEventListener("click", function (e) { if (e.target.closest("a")) toggleSheet(false); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && !sheet.hidden) { toggleSheet(false); burger.focus(); } });
  document.addEventListener("click", function (e) { if (!sheet.hidden && !e.target.closest(".topbar")) toggleSheet(false); });

  /* section moods: companion speech + active link */
  var SAY = {
    how: "A guarded app opens, I show up. That's my whole job.",
    solves: "You pick the apps. Each one gets its own rules.",
    "try": "Your turn! Two right answers unlock the pretend game.",
    watch: "Press play. I'm in the title card!",
    setup: "Mac or Windows. Pick your side.",
    guide: "Parents run the show from the dashboard.",
    readme: "The honest details live here.",
    contact: "Say hi. Ask anything."
  };
  var lastSay = 0, seen = {};
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var id = en.target.dataset.mood; if (!id) return;
      if (links.some(function (a) { return a.dataset.nav === id; })) setActive(id);
      else if (id === "try") setActive("how");
      if (SAY[id] && !seen[id] && Date.now() - lastSay > 1500 && companion.classList.contains("show")) {
        seen[id] = 1; lastSay = Date.now(); mini.say(SAY[id], 3600); mini.jump();
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-mood]").forEach(function (s) { spy.observe(s); });
  new IntersectionObserver(function (en) { if (en[0].isIntersecting) { setActive(""); } }, { rootMargin: "0px 0px -60% 0px" }).observe($(".hero"));

  /* companion appears when the big hedgehog has scrolled away */
  var companion = $("#companion");
  new IntersectionObserver(function (en) {
    companion.classList.toggle("show", !en[0].isIntersecting);
    companion.setAttribute("aria-hidden", en[0].isIntersecting ? "true" : "false");
  }, { threshold: 0.05 }).observe($("#heroStage"));

  /* ---------- hero: parallax rings + card spotlight ---------- */
  var rings = $$(".hero-rings i");
  if (!reduce) {
    $(".hero").addEventListener("pointermove", function (e) {
      var x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      rings.forEach(function (r, i) { var k = (i + 1) * 14; r.style.transform = "translate(" + (x * k).toFixed(1) + "px," + (y * k).toFixed(1) + "px)"; });
    });
  }
  $$(".ncard").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
  var heroDl = $("#heroDl");
  heroDl.addEventListener("pointerenter", function () { if (!hero.asleep) hero.setMood("cheer", 1200); });
  heroDl.addEventListener("click", function () { selectOS(os === "win" ? "win" : "mac"); });
  $(".nav-cta").addEventListener("click", function () { selectOS(os === "win" ? "win" : "mac"); });

  /* ---------- stepper ---------- */
  (function () {
    var steps = $$(".step"), panes = $$(".pane"), title = $("#screenTitle"), note = $("#screenNote");
    var titles = ["play.example.com", "Quillio: exam", "Quillio: exam", "Quillio: result", "Quillio: locked"];
    var notes = ["An illustration of a game page. Opening a guarded app is where it starts.", "Real screenshot of the exam window.", "Real screenshot. Every answer comes with a short explanation.", "Real screenshot of a passing score.", "An illustration. Closing the app ends the pass, and the next launch brings the exam back."];
    var DUR = 5200, cur = 0, timer = 0, auto = true, inView = false;
    function show(i, user) {
      cur = i;
      steps.forEach(function (s, k) {
        s.classList.toggle("on", k === i); s.setAttribute("aria-selected", k === i); s.tabIndex = k === i ? 0 : -1;
        s.classList.remove("paused");
      });
      panes.forEach(function (p, k) { p.classList.toggle("on", k === i); });
      title.textContent = titles[i]; note.textContent = notes[i];
      var bar = steps[i].querySelector(".bar");
      steps[i].style.setProperty("--dur", DUR + "ms");
      if (!auto) steps[i].classList.add("paused");
      else { bar.style.transition = "none"; bar.style.width = "0"; void bar.offsetWidth; bar.style.transition = ""; bar.style.width = ""; }
      if (user) {
        if (i === 1) hero.setMood("wow", 900);
        if (i === 3) cheerCompanion("That's the one I like.");
        if (i === 4) { mini.say("Back to guarding.", 2200); }
      }
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (auto && inView && !reduce) timer = setTimeout(function () { show((cur + 1) % steps.length); }, DUR);
    }
    steps.forEach(function (s, i) {
      s.addEventListener("click", function () { auto = false; show(i, true); });
      s.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
        if (k) { e.preventDefault(); auto = false; var n = (i + k + steps.length) % steps.length; show(n, true); steps[n].focus(); }
      });
    });
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; schedule(); if (inView && auto) show(cur); }, { threshold: .35 }).observe($("#stepper"));
    show(0);
  })();
  function cheerCompanion(t) { if (companion.classList.contains("show")) { mini.cheer(t, 2400); } }

  /* ---------- count up ---------- */
  var counted = false;
  new IntersectionObserver(function (en) {
    if (!en[0].isIntersecting || counted) return; counted = true;
    $$("[data-count]").forEach(function (b) {
      var end = +b.dataset.count, t0 = performance.now();
      if (reduce || end === 0) { b.textContent = end; return; }
      (function tick(t) { var p = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - p, 3); b.textContent = Math.round(end * e); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }, { threshold: .5 }).observe($(".facts"));

  /* ---------- solves cards (tap on touch) ---------- */
  $$(".scard").forEach(function (c) {
    c.addEventListener("click", function () {
      var open = c.getAttribute("aria-expanded") === "true";
      $$(".scard").forEach(function (x) { x.setAttribute("aria-expanded", "false"); });
      c.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  /* ---------- mini exam ---------- */
  (function () {
    var Q = [
      { s: "Mathematics", q: "Which of these numbers is a prime number?", c: ["29", "21", "27", "33"], a: 0, e: "29 can only be divided evenly by 1 and itself. 21 = 3 × 7, 27 = 3 × 9 and 33 = 3 × 11." },
      { s: "Science", q: "Which planet is closest to the Sun?", c: ["Venus", "Earth", "Mercury", "Mars"], a: 2, e: "Mercury is the first planet from the Sun." },
      { s: "English", q: "Which word is the conjunction? \"I wanted to play, but it was raining.\"", c: ["play", "but", "raining", "wanted"], a: 1, e: "\"But\" joins the two parts of the sentence. It is a conjunction." }
    ];
    var i = 0, score = 0, locked = false;
    var elQ = $("#qText"), elC = $("#qChoices"), elS = $("#qSubject"), elN = $("#qCount"), elP = $("#qProg"), elF = $("#qFeedback"), btn = $("#qNext"), res = $("#qResult");
    function render() {
      var q = Q[i]; locked = false;
      elS.textContent = q.s; elN.textContent = "Question " + (i + 1) + " of " + Q.length; elQ.textContent = q.q;
      elP.style.width = (i / Q.length * 100) + "%";
      elC.innerHTML = ""; elF.hidden = true; btn.hidden = true;
      q.c.forEach(function (t, k) {
        var b = document.createElement("button"); b.type = "button"; b.className = "choice";
        b.innerHTML = "<b>" + "ABCD"[k] + "</b><span></span>"; b.lastChild.textContent = t;
        b.addEventListener("click", function () { pick(k); }); elC.appendChild(b);
      });
    }
    function pick(k) {
      if (locked) return; locked = true;
      var q = Q[i], bs = $$(".choice", elC), ok = k === q.a;
      bs.forEach(function (b, n) { b.disabled = true; if (n === q.a) b.classList.add("right"); else if (n === k) b.classList.add("wrong"); else b.classList.add("dim"); });
      if (ok) score++;
      elF.className = "feedback " + (ok ? "ok" : "no"); elF.hidden = false;
      elF.textContent = (ok ? "Correct! " : "Not quite. ") + q.e;
      btn.textContent = i === Q.length - 1 ? "See my score" : "Next question"; btn.hidden = false; btn.focus({ preventScroll: true });
      if (ok) tryM.cheer(["Yes!", "Nice one!", "Spot on!"][i % 3], 1500); else tryM.sad("Oh no. Read the explanation.", 2200);
    }
    btn.addEventListener("click", function () {
      if (i < Q.length - 1) { i++; render(); }
      else finish();
    });
    function finish() {
      elP.style.width = "100%";
      $("#qText").parentNode.querySelectorAll(".q-top,.q-prog,#qText,#qChoices,#qFeedback,#qNext").forEach(function (n) { n.hidden = true; });
      var pass = score >= 2;
      $("#rTitle").textContent = pass ? "You passed! The app is unlocked." : "Not yet. You need 2 of 3.";
      $("#rText").textContent = "You got " + score + " of " + Q.length + " right. " + (pass ? "In the real app you would press the Open button now." : "In the real app you can try again with new questions.");
      res.hidden = false;
      if (pass) tryM.cheer("You did it!", 3200); else tryM.sad("It's okay. Try again!", 6000);
      if (pass && Math.random() < 0 ) {}
    }
    $("#qAgain").addEventListener("click", function () {
      i = 0; score = 0; res.hidden = true; tryM.setMood("happy");
      $$(".q-top,.q-prog,#qText,#qChoices", $("#quiz")).forEach(function (n) { n.hidden = false; });
      elP.style.width = "0"; render();
    });
    render();
  })();

  /* ---------- video ---------- */
  (function () {
    var v = $("#demo"), box = $("#player"), big = $("#bigplay"), chWrap = $("#chapters");
    var CH = [["Intro", 0], ["App opens", 3.7], ["The exam", 10.3], ["Result", 19.5], ["Parent PIN", 26.3], ["Dashboard", 31.3], ["Add questions", 43.3], ["App rules", 63.3], ["Settings", 79.7], ["Progress", 85.6]];
    function fmt(s) { var m = Math.floor(s / 60), x = Math.floor(s % 60); return m + ":" + (x < 10 ? "0" : "") + x; }
    CH.forEach(function (c, i) {
      var b = document.createElement("button"); b.className = "chap"; b.type = "button"; b.setAttribute("role", "listitem");
      b.innerHTML = "<time>" + fmt(c[1]) + "</time><span></span>"; b.lastChild.textContent = c[0];
      b.addEventListener("click", function () { go(c[1]); }); chWrap.appendChild(b);
    });
    var chips = $$(".chap", chWrap);
    function go(t) {
      box.classList.add("playing");
      var seek = function () { try { v.currentTime = t; } catch (e) {} v.play().catch(function () {}); };
      if (v.readyState >= 1) seek(); else { v.addEventListener("loadedmetadata", seek, { once: true }); v.load(); }
    }
    big.addEventListener("click", function () { box.classList.add("playing"); v.play().catch(function () { box.classList.remove("playing"); }); });
    v.addEventListener("play", function () { box.classList.add("playing"); mini.say("Enjoy the show!", 2200); hero.setMood("wow", 800); });
    v.addEventListener("ended", function () { box.classList.remove("playing"); big.querySelector("em").textContent = "Play again"; cheerCompanion("Now try it yourself!"); });
    v.addEventListener("timeupdate", function () {
      var t = v.currentTime, k = 0; CH.forEach(function (c, n) { if (t >= c[1] - .2) k = n; });
      chips.forEach(function (c, n) { c.classList.toggle("on", n === k && !v.paused); });
    });
    v.addEventListener("pause", function () { chips.forEach(function (c) { c.classList.remove("on"); }); });
  })();

  /* ---------- OS tabs ---------- */
  var tabs = $$(".ostabs button"), panels = $$(".os-panel"), tabInk = $(".ostab-ink");
  function placeTabInk() {
    var a = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
    tabInk.style.width = a.offsetWidth + "px"; tabInk.style.transform = "translateX(" + (a.offsetLeft - 6) + "px)";
  }
  function selectOS(o) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.os === o); t.tabIndex = t.dataset.os === o ? 0 : -1; });
    panels.forEach(function (p) { var on = p.dataset.panel === o; p.hidden = !on; p.classList.toggle("on", on); });
    placeTabInk();
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectOS(t.dataset.os); if (t.dataset.os === "win") mini.say("Windows is in Beta. Tell me what breaks!", 3200); });
    t.addEventListener("keydown", function (e) { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var n = tabs[(tabs.indexOf(t) + 1) % tabs.length]; n.focus(); selectOS(n.dataset.os); } });
  });
  selectOS(os === "win" ? "win" : "mac");
  addEventListener("resize", placeTabInk);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeTabInk(); moveInk(links.filter(function (a) { return a.dataset.nav === activeId; })[0]); });
  addEventListener("load", placeTabInk);

  /* downloads: a little celebration */
  $$("[data-track]").forEach(function (a) {
    a.addEventListener("click", function () {
      toast("Download started. Check your Downloads folder.");
      hero.cheer(); cheerCompanion("Enjoy! Follow the steps next to it.");
    });
  });

  /* ---------- copy buttons ---------- */
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea"); ta.value = t; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); } ta.remove();
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    copyText(b.dataset.copy).then(function () {
      b.classList.add("copied"); setTimeout(function () { b.classList.remove("copied"); }, 1400); toast("Copied to clipboard");
    }, function () { toast("Couldn't copy. Select the text instead."); });
  });

  /* ---------- parent guide ---------- */
  (function () {
    var G = [
      { id: "pin", t: "Sign in and set a PIN", i: "i-solves", img: "dash-overview", alt: "The Quillio dashboard with a lime welcome banner, stat cards and weekly activity",
        h: "<ol><li>Open the <b>Quillio</b> app. On a Mac it is in Applications, on Windows in the Start menu.</li><li>The first time, create an admin PIN of 4 to 32 characters. After that, sign in with it.</li><li>The Dashboard shows questions, average score, pass rate and how many apps are protected.</li></ol><p>The dashboard only listens on your own computer (127.0.0.1), so nothing else on your network can reach it.</p>" },
      { id: "q", t: "Build your own quizzes", i: "i-try", img: "dash-library", alt: "The Quiz Library page listing subjects and questions",
        h: "<ol><li>Open <b>Quiz Library</b>. Choose a subject, or create your own with <b>＋ New</b> in the Subjects list, for any grade, language or topic.</li><li>Press <b>Add question</b>, type the question and 2 to 6 answers, and mark the correct one.</li><li>Write a short explanation. Children see it right after they answer.</li><li>Press <b>Save</b>. It can appear in the next exam.</li></ol><p>You can also switch a question off or delete it. Old attempts keep the text they were asked.</p>" },
      { id: "rules", t: "Set the default rules", i: "i-how", img: "dash-settings", alt: "The Settings page with questions per exam, passing score and unlock length",
        h: "<ol><li>Open <b>Settings</b>.</li><li><b>Questions per exam</b> defaults to 10. <b>Passing score</b> defaults to 70 out of 100.</li><li><b>Unlock length after passing</b> is in minutes. 0 means unlocked until the app is closed. 30 means a new exam every 30 minutes.</li><li>Press <b>Save settings</b>.</li></ol><p>These apply to every app that has no rules of its own. Changes apply to the next quiz. An attempt in progress keeps the pass mark it started with.</p>" },
      { id: "lock", t: "Choose the guarded apps", i: "i-lock", img: "dash-applock", alt: "The App Lock page with the protection switch and a list of restricted apps",
        h: "<ol><li>Open <b>App Lock</b>.</li><li>The <b>Protection</b> switch pauses all blocking. Switch it on again when you are done.</li><li>Roblox and Roblox Studio are listed to start with. Remove them if you like.</li><li>Under <b>Add an app</b>, use <b>Quick add</b> for common games and browsers, pick from the installed list, or type a name.</li><li><b>Lock all apps now</b> ends any current unlock.</li></ol><p>Apps you do not list open normally.</p>" },
      { id: "apprules", t: "Rules for each app", i: "i-guide", img: "dash-rules", alt: "The Rules for Space Quest window: 5 questions, pass mark 80, 2 exams in a row, 30 minutes",
        h: "<ol><li>Open <b>App Lock</b> and press <b>Edit rules</b> next to an app.</li><li>Set <b>Questions per exam</b> (1 to 100) and <b>Passing score</b> (1 to 100).</li><li><b>Unlock length</b> is in minutes. 0 means until the app is closed.</li><li><b>Exams to pass in a row</b> is 1 to 5. Failing one starts the count again.</li><li>Tick <b>Subjects</b> to draw the exam from only those. Leave them all off to use every subject.</li><li>Press <b>Save</b>. <b>Use all defaults</b> removes the app's own rules.</li></ol><p>Example: a game gets 5 questions and a pass mark of 80, a browser gets 10 questions from Mathematics and English with a pass mark of 100. A field left empty uses the Settings default, and the next exam reads the new rules.</p>" },
      { id: "prog", t: "See how it is going", i: "i-watch", img: "dash-progress", alt: "The Progress page with a score trend and accuracy per subject",
        h: "<ol><li>Open <b>Progress</b> to see the score trend against the pass mark.</li><li>Check accuracy per subject and the questions missed most often.</li><li>Open any attempt to see every answer.</li></ol><p>Exams closed with Exit show as Unfinished and do not count as a score.</p>" },
      { id: "move", t: "Import and export", i: "i-setup", img: "dash-library", alt: "The Quiz Library page",
        h: "<ol><li>Open <b>Import / Export</b>.</li><li>Export gives you a JSON or CSV copy of your questions.</li><li>Import merges into your bank or replaces it. Every row is checked first, so one bad row cancels the whole import.</li></ol><p>CSV columns: subject, question, choice_a to choice_f, correct (a letter), explanation, active.</p>" },
      { id: "exit", t: "Exit and parent unlock", i: "i-guide", img: "exam-exit_pin", alt: "The exit screen asking for the admin PIN", ext: 1,
        h: "<ol><li>The <b>Exit</b> button on the exam asks for your PIN. Enter it and press <b>Exit exam</b>. The app stays closed. <b>Back</b> returns to the exam.</li><li>On the result screen, <b>Parent: open without the quiz</b> also asks for the PIN. It unlocks for 30 minutes by default.</li></ol><p>Five wrong PIN attempts lock PIN entry for 5 minutes.</p>" }
    ];
    var list = $(".g-list"), img = $("#gImg"), txt = $("#gText"), cur = "";
    G.forEach(function (g, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "gbtn"; b.setAttribute("role", "tab"); b.id = "gt-" + g.id;
      b.innerHTML = '<svg class="ico"><use href="#' + g.i + '"/></svg><span></span>'; b.lastChild.textContent = g.t;
      b.addEventListener("click", function () { pick(i, true); });
      b.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0; if (!k) return; e.preventDefault();
        var n = (i + k + G.length) % G.length; pick(n, true); list.children[n].focus();
      });
      list.appendChild(b);
    });
    function pick(i, user) {
      var g = G[i]; if (cur === g.id) return; cur = g.id;
      $$(".gbtn", list).forEach(function (b, n) { b.setAttribute("aria-selected", n === i); b.tabIndex = n === i ? 0 : -1; });
      img.classList.add("swap");
      setTimeout(function () { img.src = "assets/" + g.img + ".webp"; img.alt = g.alt; img.classList.remove("swap"); }, reduce ? 0 : 160);
      txt.style.animation = "none"; void txt.offsetWidth; txt.style.animation = "";
      txt.innerHTML = "<h3></h3>" + g.h; txt.firstChild.textContent = g.t;
      txt.setAttribute("role", "tabpanel"); txt.setAttribute("aria-labelledby", "gt-" + g.id);
      if (user && companion.classList.contains("show")) mini.jump();
    }
    pick(0);
  })();

  /* ---------- read me tabs ---------- */
  (function () {
    var tb = $$(".rtabs button"), ps = $$(".rpanel");
    tb.forEach(function (t) {
      t.addEventListener("click", function () {
        tb.forEach(function (x) { x.setAttribute("aria-selected", x === t); });
        ps.forEach(function (p) { var on = p.dataset.rp === t.dataset.r; p.hidden = !on; p.classList.toggle("on", on); });
        if (t.dataset.r === "limits") mini.say("Honest answers matter.", 2200);
      });
    });
  })();

  /* ---------- contact ---------- */
  (function () {
    var f = $("#cform"), err = $("#ferr"), note = $("#fnote"), send = $("#fsend");
    var mail = CFG.email || "", endpoint = CFG.formEndpoint, li = CFG.linkedin;
    if (mail) { $("#lnkMail").href = "mailto:" + mail; $("#mailText").textContent = mail; }
    if (li) { var a = $("#lnkLinkedin"); a.href = li; a.hidden = false; }
    note.textContent = endpoint ? "Your message goes straight to our inbox. Your email is used only to reply." : "This opens your email app with the message ready to send.";
    function data() { var d = new FormData(f); return { name: (d.get("name") || "").trim(), email: (d.get("email") || "").trim(), topic: d.get("topic"), message: (d.get("message") || "").trim() }; }
    function valid() {
      var d = data(), bad = [];
      if (!d.name) bad.push("name"); if (!/^\S+@\S+\.\S+$/.test(d.email)) bad.push("email"); if (d.message.length < 5) bad.push("message");
      $$("input,textarea", f).forEach(function (n) { n.classList.toggle("bad", bad.indexOf(n.name) > -1); });
      if (bad.length) { err.hidden = false; err.textContent = "Please fill in: " + bad.join(", ") + "."; f.elements[bad[0]].focus(); return false; }
      err.hidden = true; return true;
    }
    function text(d, pub) { return "Topic: " + d.topic + "\nFrom: " + d.name + (pub ? "" : " <" + d.email + ">") + "\n\n" + d.message; }
    f.addEventListener("submit", function (e) {
      e.preventDefault(); if (!valid()) return; var d = data();
      if (endpoint) {
        send.disabled = true; send.textContent = "Sending…";
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: d.name, email: d.email, topic: d.topic, message: d.message, _subject: "Quillio: " + d.topic + " from " + d.name, _replyto: d.email, _template: "table" }) })
          .then(function (r) { if (!r.ok) throw 0; toast("Message sent. Thank you!"); f.reset(); cheerCompanion("Sent! We'll reply soon."); if (!companion.classList.contains("show")) hero.cheer("Message sent!"); })
          .catch(function () { err.hidden = false; err.textContent = "Couldn't send. Use Copy message, or email " + mail + " directly."; })
          .then(function () { send.disabled = false; send.textContent = "Send message"; });
      } else if (mail) {
        location.href = "mailto:" + mail + "?subject=" + encodeURIComponent("Quillio: " + d.topic + " from " + d.name) + "&body=" + encodeURIComponent(text(d));
        toast("Opening your email app…");
      } else { copyText(text(d)).then(function () { toast("Message copied."); }); }
    });
    $("#fcopy").addEventListener("click", function () {
      var d = data(); if (!d.message) { err.hidden = false; err.textContent = "Write a message first."; return; } err.hidden = true;
      copyText(text(d)).then(function () { toast("Message copied."); }, function () { toast("Couldn't copy."); });
    });
  })();

  /* konami-free easter egg: press "h" anywhere for a hello */
  addEventListener("keydown", function (e) {
    if (e.key === "h" && !/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || "")) && !e.metaKey && !e.ctrlKey) { hero.cheer("Hello!"); if (companion.classList.contains("show")) mini.cheer("Hello!"); }
  });
})();

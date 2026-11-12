/* The Quillio hedgehog: one SVG, five moods, and a few habits.
   Moods: happy, wow, sad, sleep, cheer. Same artwork as the app's mascot.svg. */
(function () {
  "use strict";

  var INK = "#171715";
  var SPIKES = "M130.0 22.6 L140.8 39.8 L155.8 25.5 L161.9 44.6 L180.2 34.0 L181.1 53.9 L201.6 47.6 L197.4 67.1 L218.9 65.6 L209.7 83.5 L231.0 86.8 L217.4 102.2 L237.2 110.0 L220.0 122.0 L237.2 134.0 L217.4 141.8 L231.0 157.2 L209.7 160.5 L218.9 178.4 L197.4 176.9 L201.6 196.4 L181.1 190.1 L180.2 210.0 L161.9 199.4 L155.8 218.5 L140.8 204.2 L130.0 221.4 L119.2 204.2 L104.2 218.5 L98.1 199.4 L79.8 210.0 L78.9 190.1 L58.4 196.4 L62.6 176.9 L41.1 178.4 L50.3 160.5 L29.0 157.2 L42.6 141.8 L22.8 134.0 L40.0 122.0 L22.8 110.0 L42.6 102.2 L29.0 86.8 L50.3 83.5 L41.1 65.6 L62.6 67.1 L58.4 47.6 L78.9 53.9 L79.8 34.0 L98.1 44.6 L104.2 25.5 L119.2 39.8 Z";

  function arm(d, fill) {
    return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="27" stroke-linecap="round"/>' +
           '<path d="' + d + '" fill="none" stroke="' + fill + '" stroke-width="21" stroke-linecap="round"/>';
  }
  var STAR = "M0 -9 L2.6 -2.6 L9 0 L2.6 2.6 L0 9 L-2.6 2.6 L-9 0 L-2.6 -2.6 Z";

  function svg(opts) {
    opts = opts || {};
    var vb = opts.viewBox || "0 0 260 250";
    var animated = !opts.still;
    return '' +
    '<svg class="mascot m-happy" viewBox="' + vb + '" role="img" aria-label="Quillio hedgehog mascot" focusable="false">' +
      (animated ? '<ellipse class="ms-shadow" cx="130" cy="240" rx="70" ry="8" fill="' + INK + '" opacity=".12"/>' : '') +
      '<g class="ms-all"><g class="ms-body">' +
        '<path d="' + SPIKES + '" fill="#2E5B3A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M60 128 Q64 96 84 82" fill="none" stroke="#3F7A4D" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
        '<ellipse cx="100" cy="228" rx="22" ry="11" fill="#F7E9C9" stroke="' + INK + '" stroke-width="3"/>' +
        '<ellipse cx="160" cy="228" rx="22" ry="11" fill="#F7E9C9" stroke="' + INK + '" stroke-width="3"/>' +
        '<ellipse cx="130" cy="184" rx="52" ry="46" fill="#FFF6DF" stroke="' + INK + '" stroke-width="3"/>' +
        '<circle cx="74" cy="66" r="17" fill="#F7E9C9" stroke="' + INK + '" stroke-width="3"/><circle cx="74" cy="67" r="8" fill="#F4A6A0"/>' +
        '<circle cx="186" cy="66" r="17" fill="#F7E9C9" stroke="' + INK + '" stroke-width="3"/><circle cx="186" cy="67" r="8" fill="#F4A6A0"/>' +
        '<ellipse cx="130" cy="112" rx="68" ry="60" fill="#F7E9C9" stroke="' + INK + '" stroke-width="3"/>' +
        '<ellipse cx="130" cy="130" rx="40" ry="30" fill="#FFF6DF"/>' +
        '<ellipse cx="94" cy="130" rx="11" ry="7" fill="#F4A6A0" opacity=".75"/><ellipse cx="166" cy="130" rx="11" ry="7" fill="#F4A6A0" opacity=".75"/>' +
        /* eyes */
        '<g class="eyes" data-m="happy wow">' +
          '<g class="pupil" data-side="l"><circle cx="104" cy="104" r="9.5" fill="' + INK + '"/><circle cx="107.5" cy="100.5" r="3.4" fill="#fff"/></g>' +
          '<g class="pupil" data-side="r"><circle cx="156" cy="104" r="9.5" fill="' + INK + '"/><circle cx="159.5" cy="100.5" r="3.4" fill="#fff"/></g>' +
        '</g>' +
        '<g data-m="sad">' +
          '<circle cx="104" cy="107" r="10.5" fill="' + INK + '"/><circle cx="156" cy="107" r="10.5" fill="' + INK + '"/>' +
          '<circle cx="108" cy="103" r="4" fill="#fff"/><circle cx="100" cy="111" r="1.8" fill="#fff" opacity=".8"/>' +
          '<circle cx="160" cy="103" r="4" fill="#fff"/><circle cx="152" cy="111" r="1.8" fill="#fff" opacity=".8"/>' +
        '</g>' +
        '<g data-m="sleep"><path d="M93 106 Q104 116 115 106" fill="none" stroke="' + INK + '" stroke-width="3.6" stroke-linecap="round"/><path d="M145 106 Q156 116 167 106" fill="none" stroke="' + INK + '" stroke-width="3.6" stroke-linecap="round"/></g>' +
        '<g data-m="cheer"><path d="M93 109 Q104 94 115 109" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><path d="M145 109 Q156 94 167 109" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/></g>' +
        /* brows */
        '<g class="brows" data-m="happy wow cheer"><path d="M91 90 Q104 82 116 89" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M144 89 Q156 82 169 90" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/></g>' +
        '<g data-m="sad"><path d="M90 94 Q103 90 117 80" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M143 80 Q157 90 170 94" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
          '<g class="tear"><path d="M92 120 Q84 134 92 142 Q100 134 92 120 Z" fill="#8FD3F4" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/></g></g>' +
        /* nose + mouths */
        '<ellipse cx="130" cy="122" rx="12" ry="8.5" fill="' + INK + '"/><ellipse cx="127" cy="119.5" rx="3.6" ry="2" fill="#fff" opacity=".6"/>' +
        '<path data-m="happy" d="M116 137 Q130 152 144 137" fill="#C9514A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<path data-m="cheer" d="M111 135 Q130 164 149 135 Z" fill="#C9514A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<ellipse data-m="wow" cx="130" cy="145" rx="9" ry="11" fill="#C9514A" stroke="' + INK + '" stroke-width="3"/>' +
        '<path data-m="sad" d="M117 148 Q130 133 143 148" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<path data-m="sleep" d="M121 142 Q130 148 139 142" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        /* scarf */
        '<path d="M86 160 Q130 188 174 160" fill="none" stroke="' + INK + '" stroke-width="19" stroke-linecap="round"/>' +
        '<path d="M86 160 Q130 188 174 160" fill="none" stroke="#DDF264" stroke-width="13" stroke-linecap="round"/>' +
        '<path d="M150 176 L158 202" stroke="' + INK + '" stroke-width="17" stroke-linecap="round"/>' +
        '<path d="M150 176 L158 202" stroke="#DDF264" stroke-width="11" stroke-linecap="round"/>' +
        /* arms */
        '<g data-m="happy wow sad sleep">' + arm("M90 180 Q68 192 72 216", "#F7E9C9") + '</g>' +
        '<g class="arm-l-up" data-m="cheer">' + arm("M90 182 Q48 176 40 128", "#F7E9C9") + '</g>' +
        '<g class="arm-r-up" data-m="happy wow cheer">' + arm("M170 182 Q212 176 220 128", "#F7E9C9") +
          '<path d="M236 112 q8 6 6 16 M244 104 q10 8 8 22" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/></g>' +
        '<g data-m="sad sleep">' + arm("M170 182 Q192 196 188 218", "#F7E9C9") + '</g>' +
      '</g></g>' +
      (animated ?
      '<g class="sparks" data-m="cheer">' +
        '<path class="spark" transform="translate(34 40)" d="' + STAR + '" fill="#DDF264" stroke="' + INK + '" stroke-width="2"/>' +
        '<path class="spark" transform="translate(228 56)" d="' + STAR + '" fill="#DDF264" stroke="' + INK + '" stroke-width="2"/>' +
        '<path class="spark" transform="translate(130 4)" d="' + STAR + '" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
      '</g>' +
      '<g class="zzz" data-m="sleep"><text x="178" y="46">Z</text><text x="196" y="32">z</text><text x="210" y="20">z</text></g>' +
      '<g class="dizzy"><path transform="translate(80 18)" d="' + STAR + '" fill="#DDF264" stroke="' + INK + '" stroke-width="2"/><path transform="translate(130 6)" d="' + STAR + '" fill="#fff" stroke="' + INK + '" stroke-width="2"/><path transform="translate(180 18)" d="' + STAR + '" fill="#DDF264" stroke="' + INK + '" stroke-width="2"/></g>' : '') +
    '</svg>';
  }

  var POKE = [
    "Hello! Ready for a quiz?",
    "Ha! That tickles.",
    "The app is waiting. Questions first!",
    "Reach the pass mark and the app is yours.",
    "I never peek at the answers.",
    "Psst. Try the mini exam below.",
    "My spikes are for show. I'm very soft.",
    "You pick which apps get guarded.",
    "Everything stays on your computer."
  ];

  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function create(host, opts) {
    opts = opts || {};
    host.innerHTML = svg();
    var el = host.querySelector("svg");
    var bubble = document.createElement("div");
    bubble.className = "bubble"; bubble.setAttribute("aria-hidden", "true");
    host.appendChild(bubble);
    if (!opts.decorative) {
      host.setAttribute("role", "button"); host.tabIndex = 0;
      host.setAttribute("aria-label", opts.label || "Hedgehog mascot. Press to say hi.");
    } else { el.setAttribute("aria-hidden", "true"); }

    var pupils = host.querySelectorAll(".pupil");
    var mood = "happy", moodTimer = 0, bubbleTimer = 0, idleTimer = 0, asleep = false, clicks = [], lastMove = Date.now();

    function setMood(m, ms) {
      clearTimeout(moodTimer);
      mood = m;
      el.setAttribute("class", el.getAttribute("class").replace(/\bm-\w+/g, "").trim() + " m-" + m);
      if (m !== "happy" && m !== "wow") center();
      if (ms) moodTimer = setTimeout(function () { setMood("happy"); }, ms);
    }
    function pulse(cls, ms) {
      el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls);
      setTimeout(function () { el.classList.remove(cls); }, ms);
    }
    function say(text, ms) {
      clearTimeout(bubbleTimer);
      bubble.textContent = text; bubble.classList.add("on");
      bubbleTimer = setTimeout(function () { bubble.classList.remove("on"); }, ms || 2800);
    }
    function center() { pupils.forEach(function (p) { p.style.transform = ""; }); }
    function jump() { if (!reduce) pulse("jump", 760); }
    function roll() { if (!reduce) pulse("roll", 1200); }
    function shake() { if (!reduce) pulse("shake", 500); }
    function cheer(text, ms) { setMood("cheer", ms || 1800); jump(); if (text) say(text, ms || 2400); }
    function sad(text, ms) { setMood("sad", ms || 2600); shake(); if (text) say(text, ms || 2600); }

    /* eyes follow the pointer */
    var raf = 0, px = 0, py = 0;
    function look() {
      raf = 0;
      if (mood !== "happy" && mood !== "wow") return;
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      var cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.42;
      var dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 240);
      var x = (dx / d) * 5.5 * k, y = (dy / d) * 4.2 * k;
      pupils.forEach(function (p) { p.style.transform = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px)"; });
    }
    function onMove(e) {
      px = e.clientX; py = e.clientY; lastMove = Date.now();
      if (!raf) raf = requestAnimationFrame(look);
      if (asleep) wake();
    }
    if (!opts.still) addEventListener("pointermove", onMove, { passive: true });

    /* blinking */
    (function blink() {
      setTimeout(function () {
        if (mood === "happy" || mood === "wow") pulse("blink", 200);
        blink();
      }, 2200 + Math.random() * 3600);
    })();

    /* falls asleep when nothing happens for a while */
    function wake() {
      asleep = false;
      setMood("wow", 900); jump();
      say("Oh! I was only resting my eyes.", 2600);
    }
    if (opts.sleepy) {
      setInterval(function () {
        if (asleep || document.hidden) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        if (Date.now() - lastMove > 22000) { asleep = true; setMood("sleep"); say("Zzz…", 2000); }
      }, 2000);
      host.addEventListener("click", function () { if (asleep) { /* handled in click */ } });
    }

    /* poke */
    function poke() {
      if (asleep) { wake(); return; }
      var now = Date.now();
      clicks = clicks.filter(function (t) { return now - t < 3000; }); clicks.push(now);
      if (clicks.length >= 5) {
        clicks = [];
        setMood("wow", 1500); roll(); say("Whoa! I'm dizzy!", 2400);
        return;
      }
      setMood("wow", 700); jump();
      say(opts.lines ? rand(opts.lines) : rand(POKE), 2600);
      if (opts.onPoke) opts.onPoke();
    }
    host.addEventListener("click", poke);
    host.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); poke(); } });
    host.addEventListener("pointerenter", function () { if (mood === "happy" && !asleep && !reduce) { /* wave handled in css */ } });

    return { el: el, host: host, setMood: setMood, say: say, jump: jump, roll: roll, shake: shake, cheer: cheer, sad: sad,
             get mood() { return mood; }, get asleep() { return asleep; } };
  }

  window.AHMascot = { create: create, svg: svg, lines: POKE };
})();

// NSM animated winks: original characters drawn in SVG and animated with CSS (see characters.css).
// Each one has a short tune played with the Web Audio API by the app.
// Notes: [frequency Hz, seconds, optional end frequency for a slide]; frequency 0 = silence.
(function () {
  "use strict";

  const pig = `
<svg class="ch ch-pig" viewBox="0 0 220 240" aria-hidden="true">
  <g class="pig-sway"><g class="pig-all">
    <rect class="pig-leg pig-l1" x="78" y="168" width="18" height="44" rx="8" fill="#9e2424"/>
    <rect class="pig-leg pig-l2" x="124" y="168" width="18" height="44" rx="8" fill="#9e2424"/>
    <path class="pig-tail" d="M164 132 q20 -4 16 -20 q-5 -12 -15 -2" stroke="#9e2424" stroke-width="6" fill="none" stroke-linecap="round"/>
    <rect class="pig-arm pig-a1" x="42" y="118" width="16" height="44" rx="8" fill="#b92d2d"/>
    <rect class="pig-arm pig-a2" x="162" y="118" width="16" height="44" rx="8" fill="#b92d2d"/>
    <ellipse cx="110" cy="140" rx="60" ry="48" fill="#d63b3b"/>
    <ellipse cx="110" cy="150" rx="34" ry="26" fill="#e65a5a"/>
    <g class="pig-head">
      <path d="M72 58 L66 22 L98 44 Z" fill="#b92d2d"/>
      <path d="M148 58 L154 22 L122 44 Z" fill="#b92d2d"/>
      <circle cx="110" cy="80" r="44" fill="#d63b3b"/>
      <circle cx="84" cy="96" r="8" fill="#ef7b7b" opacity=".8"/>
      <circle cx="136" cy="96" r="8" fill="#ef7b7b" opacity=".8"/>
      <ellipse cx="110" cy="94" rx="20" ry="14" fill="#f07c7c" stroke="#9e2424" stroke-width="2.5"/>
      <ellipse cx="103" cy="94" rx="3.5" ry="5" fill="#7a1a1a"/>
      <ellipse cx="117" cy="94" rx="3.5" ry="5" fill="#7a1a1a"/>
      <g class="ch-blink">
        <circle cx="94" cy="70" r="8" fill="#fff"/><circle cx="126" cy="70" r="8" fill="#fff"/>
        <circle cx="96" cy="71" r="4" fill="#1d1d1d"/><circle cx="128" cy="71" r="4" fill="#1d1d1d"/>
      </g>
      <path d="M98 112 q12 9 24 0" stroke="#7a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
  </g></g>
  <text class="ch-note n1" x="22" y="70" font-size="28" fill="#d63b3b">♪</text>
  <text class="ch-note n2" x="182" y="60" font-size="32" fill="#e07b26">♫</text>
  <text class="ch-note n3" x="196" y="140" font-size="24" fill="#8a5cd6">♪</text>
</svg>`;

  const frog = `
<svg class="ch ch-frog" viewBox="0 0 220 200" aria-hidden="true">
  <ellipse class="ch-shadow frog-shadow" cx="110" cy="188" rx="46" ry="7" fill="#000" opacity=".15"/>
  <g class="frog-all">
    <ellipse cx="62" cy="160" rx="26" ry="14" fill="#2f8a4a"/>
    <ellipse cx="158" cy="160" rx="26" ry="14" fill="#2f8a4a"/>
    <ellipse cx="110" cy="135" rx="58" ry="44" fill="#3fae5d"/>
    <ellipse cx="110" cy="148" rx="38" ry="26" fill="#bfe8a6"/>
    <rect x="80" y="160" width="14" height="22" rx="6" fill="#2f8a4a"/>
    <rect x="126" y="160" width="14" height="22" rx="6" fill="#2f8a4a"/>
    <circle cx="82" cy="88" r="22" fill="#3fae5d"/><circle cx="138" cy="88" r="22" fill="#3fae5d"/>
    <g class="ch-blink">
      <circle cx="82" cy="86" r="14" fill="#fff"/><circle cx="138" cy="86" r="14" fill="#fff"/>
      <circle cx="85" cy="88" r="7" fill="#1d1d1d"/><circle cx="141" cy="88" r="7" fill="#1d1d1d"/>
    </g>
    <path d="M78 122 q32 22 64 0" stroke="#1f5e33" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect class="frog-tongue" x="108" y="122" width="70" height="8" rx="4" fill="#e05a6a"/>
  </g>
</svg>`;

  const cat = `
<svg class="ch ch-cat" viewBox="0 0 240 220" aria-hidden="true">
  <g class="cat-bubble">
    <path d="M150 18 h70 a12 12 0 0 1 12 12 v30 a12 12 0 0 1 -12 12 h-48 l-14 14 v-14 h-8 a12 12 0 0 1 -12 -12 v-30 a12 12 0 0 1 12 -12 z" fill="#ffffff" stroke="#c9d3dc" stroke-width="2"/>
    <text x="185" y="54" text-anchor="middle" font-size="22" font-weight="700" fill="#1f6f8b" font-family="Bricolage Grotesque, sans-serif">Hey!</text>
  </g>
  <path class="cat-tail" d="M150 190 q50 -10 40 -60 q-4 -16 -14 -10" stroke="#7d8a99" stroke-width="12" fill="none" stroke-linecap="round"/>
  <ellipse cx="110" cy="168" rx="46" ry="42" fill="#7d8a99"/>
  <ellipse cx="110" cy="176" rx="26" ry="28" fill="#e6ebf0"/>
  <ellipse cx="92" cy="206" rx="14" ry="8" fill="#6b7785"/><ellipse cx="128" cy="206" rx="14" ry="8" fill="#6b7785"/>
  <rect class="cat-paw" x="142" y="96" width="16" height="44" rx="8" fill="#7d8a99"/>
  <g>
    <path d="M70 70 L74 26 L102 52 Z" fill="#7d8a99"/><path d="M150 70 L146 26 L118 52 Z" fill="#7d8a99"/>
    <path d="M78 60 L80 38 L94 52 Z" fill="#f2b8c6"/><path d="M142 60 L140 38 L126 52 Z" fill="#f2b8c6"/>
    <circle cx="110" cy="88" r="44" fill="#7d8a99"/>
    <g class="ch-blink">
      <ellipse cx="92" cy="84" rx="8" ry="10" fill="#f2d16b"/><ellipse cx="128" cy="84" rx="8" ry="10" fill="#f2d16b"/>
      <ellipse cx="92" cy="85" rx="3" ry="8" fill="#1d1d1d"/><ellipse cx="128" cy="85" rx="3" ry="8" fill="#1d1d1d"/>
    </g>
    <path d="M105 100 h10 l-5 6 z" fill="#f28ba0"/>
    <path d="M110 106 q-6 8 -12 4 M110 106 q6 8 12 4" stroke="#3a3f45" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M70 100 h-22 M72 108 h-22 M150 100 h22 M148 108 h22" stroke="#3a3f45" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

  const penguin = `
<svg class="ch ch-penguin" viewBox="0 0 220 230" aria-hidden="true">
  <g class="peng-all">
    <ellipse cx="88" cy="214" rx="18" ry="8" fill="#f29a2e"/><ellipse cx="132" cy="214" rx="18" ry="8" fill="#f29a2e"/>
    <path class="peng-f1" d="M56 110 q-26 30 -16 66 q12 -6 22 -30 z" fill="#1d2b44"/>
    <path class="peng-f2" d="M164 110 q26 30 16 66 q-12 -6 -22 -30 z" fill="#1d2b44"/>
    <ellipse cx="110" cy="140" rx="58" ry="74" fill="#23324d"/>
    <ellipse cx="110" cy="152" rx="40" ry="58" fill="#f5f7fa"/>
    <g class="ch-blink">
      <circle cx="94" cy="96" r="9" fill="#fff"/><circle cx="126" cy="96" r="9" fill="#fff"/>
      <circle cx="96" cy="97" r="4.5" fill="#1d1d1d"/><circle cx="128" cy="97" r="4.5" fill="#1d1d1d"/>
    </g>
    <path d="M98 110 h24 l-12 14 z" fill="#f29a2e"/>
    <circle cx="84" cy="116" r="6" fill="#f2a7c3" opacity=".7"/><circle cx="136" cy="116" r="6" fill="#f2a7c3" opacity=".7"/>
    <path d="M74 62 q36 -26 72 0 q-6 -30 -36 -30 q-30 0 -36 30" fill="#d64545"/>
    <circle cx="110" cy="30" r="9" fill="#ffffff"/>
  </g>
</svg>`;

  const ghost = `
<svg class="ch ch-ghost" viewBox="0 0 220 230" aria-hidden="true">
  <g class="ghost-all">
    <path d="M40 200 V100 a70 70 0 0 1 140 0 V200 l-18 -16 l-17 16 l-17 -16 l-18 16 l-17 -16 l-17 16 l-18 -16 z" fill="#ffffff" stroke="#c9d3dc" stroke-width="3"/>
    <ellipse cx="84" cy="96" rx="11" ry="16" fill="#1d1d1d"/><ellipse cx="136" cy="96" rx="11" ry="16" fill="#1d1d1d"/>
    <ellipse class="ghost-mouth" cx="110" cy="140" rx="14" ry="18" fill="#1d1d1d"/>
    <circle cx="70" cy="122" r="8" fill="#f2a7c3" opacity=".6"/><circle cx="150" cy="122" r="8" fill="#f2a7c3" opacity=".6"/>
  </g>
  <text class="ghost-boo" x="110" y="40" text-anchor="middle" font-size="44" font-weight="700" fill="#8a5cd6" font-family="Bricolage Grotesque, sans-serif">BOO!</text>
</svg>`;

  const robot = `
<svg class="ch ch-robot" viewBox="0 0 220 240" aria-hidden="true">
  <g class="robot-all">
    <line x1="110" y1="22" x2="110" y2="44" stroke="#5d6d7c" stroke-width="4"/>
    <circle class="robot-light" cx="110" cy="18" r="8" fill="#f2a541"/>
    <rect class="robot-arm robot-a1" x="30" y="112" width="16" height="56" rx="8" fill="#5d6d7c"/>
    <rect class="robot-arm robot-a2" x="174" y="112" width="16" height="56" rx="8" fill="#5d6d7c"/>
    <rect class="robot-leg robot-l1" x="82" y="190" width="18" height="38" rx="5" fill="#5d6d7c"/>
    <rect class="robot-leg robot-l2" x="120" y="190" width="18" height="38" rx="5" fill="#5d6d7c"/>
    <rect x="48" y="104" width="124" height="92" rx="16" fill="#3d7fd6"/>
    <rect x="76" y="124" width="68" height="44" rx="8" fill="#dcecf2"/>
    <circle class="robot-heart" cx="110" cy="146" r="10" fill="#d64545"/>
    <g class="robot-head">
      <rect x="60" y="42" width="100" height="66" rx="16" fill="#4fb3d3"/>
      <g class="ch-blink"><rect x="80" y="62" width="18" height="18" rx="4" fill="#16212c"/><rect x="122" y="62" width="18" height="18" rx="4" fill="#16212c"/></g>
      <rect x="88" y="90" width="44" height="6" rx="3" fill="#16212c"/>
    </g>
  </g>
</svg>`;

  window.NSM_CHARS = [
    { id: "pig", name: "Dancing pig", e: "🐷", svg: pig, ms: 4600,
      tune: { type: "square", vol: 0.07, notes: [[523,.15],[659,.15],[784,.15],[659,.15],[523,.15],[659,.15],[784,.3],[0,.1],[880,.15],[784,.15],[659,.15],[587,.15],[523,.4]] } },
    { id: "frog", name: "Jumping frog", e: "🐸", svg: frog, ms: 4600,
      tune: { type: "triangle", vol: 0.16, notes: [[0,.3],[200,.08,150],[0,.45],[200,.08,150],[0,.45],[200,.08,150],[0,.45],[200,.08,150]] } },
    { id: "cat", name: "Hi cat", e: "🐱", svg: cat, ms: 4600,
      tune: { type: "sine", vol: 0.14, notes: [[520,.18,820],[820,.32,460],[0,.5],[600,.12,900],[900,.22,600]] } },
    { id: "penguin", name: "Penguin dance", e: "🐧", svg: penguin, ms: 4600,
      tune: { type: "sine", vol: 0.14, notes: [[400,.5,900],[900,.5,400],[400,.5,900],[900,.6,500]] } },
    { id: "ghost", name: "Boo ghost", e: "👻", svg: ghost, ms: 4600,
      tune: { type: "sine", vol: 0.16, notes: [[330,.6,250],[0,.6],[180,.15],[520,.5,300]] } },
    { id: "robot", name: "Robot dance", e: "🤖", svg: robot, ms: 4600,
      tune: { type: "square", vol: 0.06, notes: [[392,.12],[392,.12],[523,.12],[0,.12],[392,.12],[466,.12],[523,.24],[0,.12],[784,.1],[659,.1],[523,.3]] } }
  ];

  // Put the character on a stage inside an overlay element.
  window.NSM_renderChar = function (layer, id) {
    const c = window.NSM_CHARS.find(x => x.id === id);
    if (!c) return false;
    const stage = document.createElement("div");
    stage.className = "ch-stage";
    stage.innerHTML = c.svg;
    layer.appendChild(stage);
    return true;
  };

  // Play a character's tune with an AudioContext supplied by the app.
  window.NSM_playTune = function (ac, id) {
    const c = window.NSM_CHARS.find(x => x.id === id);
    if (!c || !ac) return;
    let t = ac.currentTime + 0.05;
    for (const [f, d, f2] of c.tune.notes) {
      if (f > 0) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = c.tune.type;
        o.frequency.setValueAtTime(f, t);
        if (f2) o.frequency.linearRampToValueAtTime(f2, t + d);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(c.tune.vol, t + 0.015);
        g.gain.setValueAtTime(c.tune.vol, t + Math.max(0.02, d - 0.04));
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(ac.destination);
        o.start(t); o.stop(t + d + 0.02);
      }
      t += d;
    }
  };
})();

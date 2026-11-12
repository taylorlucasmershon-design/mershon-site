/* Site logic. You shouldn't need to edit this file:
   words and links are in content/site.js, pieces in content/works.js. */
(function () {
  const S = window.SITE, W = window.WORKS;
  const app = document.getElementById("app");
  const cats = Object.fromEntries(S.categories.map(c => [c.id, c]));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const thumb = n => `images/thumb/${n}.jpg`;
  const full = n => `images/full/${n}.jpg`;

  // Category graphics: inline SVGs so they take the tile's text color; PNGs etc. stay as images.
  const iconCache = {};
  function icon(c) {
    const img = `<img src="${esc(c.icon)}" alt="">`;
    if (!/\.svg$/i.test(c.icon) || location.protocol === "file:") return img;
    if (iconCache[c.icon]) return iconCache[c.icon];
    fetch(c.icon).then(r => r.ok ? r.text() : Promise.reject()).then(t => {
      iconCache[c.icon] = t.replace(/<!--[\s\S]*?-->/g, "");
      document.querySelectorAll(`[data-icon="${c.id}"]`).forEach(el => el.innerHTML = iconCache[c.icon]);
    }).catch(() => {});
    return img;
  }
  const varsFor = c => `--c:${c.color};--k:${c.ink}`;

  // Header + footer
  document.getElementById("brand-mark").innerHTML = "<i></i><i></i><i></i><i></i>";
  document.getElementById("brand-name").textContent = S.name;
  document.getElementById("menu").innerHTML =
    S.categories.map(c => `<a href="#${c.id}" data-r="${c.id}" style="${varsFor(c)}">${esc(c.short || c.label)}</a>`).join("") +
    `<a href="#about" data-r="about">About</a>`;
  const year = new Date().getFullYear();
  document.getElementById("foot").innerHTML =
    `<span>© ${year} ${esc(S.name)} · ${esc(S.location)}</span>
     <span class="links">${S.email ? `<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : ""}${S.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</span>`;

  // Grid (shortest-column masonry, keeps reading order roughly left-to-right)
  let currentList = [];
  function colCount() {
    const w = window.innerWidth;
    return w >= 1200 ? 4 : w >= 820 ? 3 : w >= 360 ? 2 : 1;
  }
  function grid(list, showDot) {
    currentList = list;
    const n = colCount(), cols = Array.from({ length: n }, () => []), h = new Array(n).fill(0);
    list.forEach((w, i) => {
      const k = h.indexOf(Math.min(...h));
      cols[k].push([w, i]); h[k] += 1 / (w.ratio || 1) + 0.18;
    });
    return `<div class="grid" data-cols="${n}">` + cols.map(col => `<div class="col">` + col.map(([w, i]) => {
      const c = cats[w.category] || {};
      return `<button class="item" data-i="${i}" style="${varsFor(c)}">
        <div class="frame" style="aspect-ratio:${w.ratio || 1}">
          <img src="${thumb(w.images[0])}" alt="${esc(w.title)}" loading="lazy" decoding="async" onload="this.classList.add('loaded')">
          ${w.images.length > 1 ? `<span class="more">+${w.images.length - 1}</span>` : ""}
        </div>
        <div class="cap"><b>${showDot ? `<span class="dot"></span>` : ""}${esc(w.title)}</b><span>${esc(w.meta)}</span></div>
      </button>`;
    }).join("") + `</div>`).join("") + `</div>`;
  }

  // Views
  function home() {
    const counts = Object.fromEntries(S.categories.map(c => [c.id, W.filter(w => w.category === c.id).length]));
    const feat = W.filter(w => w.featured);
    document.title = `${S.name} · ${S.roles}`;
    return `<section class="wrap hero">
        <h1 class="display">${esc(S.name)}</h1>
        <p class="roles">${esc(S.roles)}</p>
        <p class="intro">${esc(S.intro)}</p>
        <div class="actions">
          <a class="btn solid" href="#about">About & contact</a>
          ${S.resume ? `<a class="btn" href="${esc(S.resume)}" target="_blank" rel="noopener">Résumé</a>` : ""}
        </div>
      </section>
      <section class="wrap cats" aria-label="Sections">
        ${S.categories.map(c => `<a class="cat-row" href="#${c.id}">
          <div class="cat-text">
            <span class="label">${counts[c.id]} projects</span>
            <h2 class="display">${esc(c.label)}</h2>
            <p>${esc(c.blurb)}</p>
            <span class="go">View work →</span>
          </div>
          <div class="cat-img">${c.cover ? `<img src="${thumb(c.cover)}" alt="" loading="lazy" style="object-position:${esc(c.coverPosition || "center")}">` : ""}</div>
        </a>`).join("")}
      </section>
      <section class="wrap">
        <div class="section-head"><h2 class="display">Selected work</h2><span class="label">${feat.length} pieces</span></div>
        <div id="g">${grid(feat, true)}</div>
      </section>`;
  }
  let filter = null;
  function category(c) {
    document.title = `${c.label} · ${S.name}`;
    const all = W.filter(w => w.category === c.id);
    const tags = (c.filters || []).filter(t => all.some(w => (w.tags || []).includes(t)));
    const list = filter ? all.filter(w => (w.tags || []).includes(filter)) : all;
    return `<section class="wrap cat-head" style="${varsFor(c)}">
        <div class="badge"><span data-icon="${c.id}">${icon(c)}</span></div>
        <div><span class="label">${all.length} projects</span><h1 class="display">${esc(c.label)}</h1><p>${esc(c.blurb)}</p></div>
      </section>
      <section class="wrap">
        ${tags.length ? `<div class="filters" role="group" aria-label="Filter">
          <button class="chip" data-f="" aria-pressed="${!filter}">All</button>
          ${tags.map(t => `<button class="chip" data-f="${esc(t)}" aria-pressed="${filter === t}">${esc(t)}</button>`).join("")}
        </div>` : ""}
        <div id="g">${grid(list, false)}</div>
      </section>`;
  }
  function about() {
    const a = S.about;
    document.title = `About · ${S.name}`;
    const rows = r => `<div class="rows">${r.map(([b, s, e]) => `<div><b>${esc(b)}</b><em>${esc(e || "")}</em><span>${esc(s)}</span></div>`).join("")}</div>`;
    currentList = [];
    return `<section class="wrap about">
      <div class="bio"><h1 class="display">Hello.</h1>${a.bio.map(p => `<p>${esc(p)}</p>`).join("")}
        <div class="contact-line">
          ${S.email ? `<a class="btn solid" href="mailto:${esc(S.email)}">${esc(S.email)}</a>` : ""}
          ${S.links.map(l => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}
          ${S.resume ? `<a class="btn" href="${esc(S.resume)}" target="_blank" rel="noopener">Résumé ↗</a>` : ""}
        </div>
      </div>
      <div class="side">
        <div><div class="label">Experience</div>${rows(a.experience)}</div>
        <div><div class="label">Education</div>${rows(a.education)}</div>
        <div><div class="label">Tools</div><p style="margin:10px 0 0">${esc(a.tools)}</p></div>
        <div><div class="label">Based in</div><p style="margin:10px 0 0">${esc(S.location)}</p></div>
      </div>
    </section>`;
  }

  function route() {
    const r = location.hash.replace(/^#/, "");
    const c = cats[r];
    if (!c) filter = null;
    app.innerHTML = c ? category(c) : r === "about" ? about() : home();
    document.querySelectorAll("#menu a").forEach(a => a.dataset.r === r ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  }
  let lastRoute = null;
  function onHash() {
    const r = location.hash;
    if (r !== lastRoute) { if (lastRoute !== null) filter = null; lastRoute = r; route(); window.scrollTo(0, 0); }
  }
  window.addEventListener("hashchange", onHash);

  app.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (chip) { filter = chip.dataset.f || null; const y = window.scrollY; route(); window.scrollTo(0, y); return; }
    const it = e.target.closest(".item");
    if (it) openViewer(+it.dataset.i, 0);
  });
  let lastCols = colCount();
  window.addEventListener("resize", () => {
    const n = colCount(); if (n === lastCols) return; lastCols = n;
    const g = document.getElementById("g"); if (g && currentList.length) g.innerHTML = grid(currentList, !cats[location.hash.slice(1)]);
  });

  // Viewer
  const V = document.getElementById("viewer"), VI = V.querySelector("img");
  let vw = 0, vi = 0, opener = null;
  function show() {
    const w = currentList[vw];
    VI.src = full(w.images[vi]); VI.alt = w.title;
    V.querySelector("b").textContent = w.title;
    V.querySelector(".meta").textContent = w.meta;
    V.querySelector(".n").textContent = w.images.length > 1 ? `${vi + 1} / ${w.images.length}` : "";
    const nx = w.images[vi + 1] || (currentList[vw + 1] && currentList[vw + 1].images[0]);
    if (nx) new Image().src = full(nx);
  }
  function openViewer(i, j) { opener = document.activeElement; vw = i; vi = j; show(); V.hidden = false; document.body.classList.add("locked"); V.querySelector(".x").focus(); }
  function closeViewer() { V.hidden = true; VI.removeAttribute("src"); document.body.classList.remove("locked"); opener && opener.focus && opener.focus(); }
  function step(d) {
    const w = currentList[vw];
    vi += d;
    if (vi >= w.images.length) { vw = (vw + 1) % currentList.length; vi = 0; }
    else if (vi < 0) { vw = (vw - 1 + currentList.length) % currentList.length; vi = currentList[vw].images.length - 1; }
    show();
  }
  V.querySelector(".x").onclick = closeViewer;
  V.querySelector(".prev").onclick = () => step(-1);
  V.querySelector(".next").onclick = () => step(1);
  V.querySelector(".stage").addEventListener("click", e => { if (e.target === e.currentTarget) closeViewer(); });
  document.addEventListener("keydown", e => {
    if (V.hidden) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  let sx = null;
  V.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
  V.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); sx = null; });

  onHash();
})();

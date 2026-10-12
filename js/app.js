(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROOT = document.body.dataset.root || "";
  const PAGE = document.body.dataset.page;

  /* ===== Stockage ===== */
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };
  const allProgress = () => store.get("lms-progress", {});
  const doneOf = id => allProgress()[id] || [];
  const pct = c => Math.round((doneOf(c.id).length / c.lessons.length) * 100);
  const lessonBody = l => (typeof l.body === "string" ? l.body : I18N.pick(l.body));

  /* ===== Thème ===== */
  const initialTheme = localStorage.getItem("lms-theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;

  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("lms-theme", t);
    const b = $("#theme-btn");
    if (b) b.textContent = t === "dark" ? "☀️" : "🌙";
  };

  /* ===== Header / Footer ===== */
  function renderLayout() {
    const active = PAGE === "home" ? "home" : "courses";
    $("#site-header").innerHTML = `
      <div class="container nav-wrap">
        <a class="logo" href="${ROOT}index.html"><span class="logo-mark">E</span>Edu<b>Learn</b></a>
        <nav class="main-nav" id="nav" aria-label="Navigation">
          <a href="${ROOT}index.html" class="${active === "home" ? "active" : ""}" data-i18n="nav.home"></a>
          <a href="${ROOT}pages/courses.html" class="${active === "courses" ? "active" : ""}" data-i18n="nav.courses"></a>
        </nav>
        <div class="tools">
          <select id="lang-select" aria-label="Language">
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
            <option value="ar">🇹🇳 AR</option>
          </select>
          <button class="icon-btn" id="theme-btn" data-i18n-aria="theme.toggle"></button>
          <button class="burger" id="burger" data-i18n-aria="menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
      </div>`;
    $("#site-footer").innerHTML = `<div class="container"><p data-i18n="footer.rights"></p></div>`;

    $("#lang-select").value = I18N.lang;
    $("#lang-select").addEventListener("change", e => { I18N.set(e.target.value); boot(); });
    $("#theme-btn").addEventListener("click", () =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
    $("#burger").addEventListener("click", e => {
      const open = $("#nav").classList.toggle("open");
      e.currentTarget.classList.toggle("open", open);
      e.currentTarget.setAttribute("aria-expanded", open);
    });
    setTheme(document.documentElement.dataset.theme);
  }

  /* ===== Carte de cours ===== */
  function courseCard(c) {
    const p = pct(c);
    const label = p === 100 ? I18N.t("review") : p > 0 ? I18N.t("continue") : I18N.t("start");
    return `
      <article class="card" style="--c1:${c.c1};--c2:${c.c2}">
        <div class="card-cover">
          <span class="card-icon">${c.icon}</span>
          <span class="badge">${I18N.t("level." + c.level)}</span>
        </div>
        <div class="card-body">
          <span class="cat">${CATEGORIES[c.cat].icon} ${I18N.pick(CATEGORIES[c.cat].name)}</span>
          <h3>${I18N.pick(c.title)}</h3>
          <p>${I18N.pick(c.desc)}</p>
          <div class="meta"><span>📚 ${c.lessons.length} ${I18N.t("lessons")}</span><span>⏱ ${c.hours}h</span></div>
          <div class="progress"><div class="progress-fill" style="width:${p}%"></div></div>
          <div class="card-foot">
            <span class="pct">${p}%</span>
            <a class="btn btn-sm" href="${ROOT}pages/course.html?id=${c.id}">${label}</a>
          </div>
        </div>
      </article>`;
  }

  /* ===== Page d'accueil ===== */
  function renderHome() {
    document.title = "EduLearn";
    const totalLessons = COURSES.reduce((s, c) => s + c.lessons.length, 0);
    const totalHours = COURSES.reduce((s, c) => s + c.hours, 0);
    const done = COURSES.reduce((s, c) => s + doneOf(c.id).length, 0);

    $("#stats").innerHTML = [
      [COURSES.length, "stat.courses"], [totalLessons, "stat.lessons"],
      [totalHours + "h", "stat.hours"], [done, "stat.done"]
    ].map(([n, k]) => `<div class="stat"><strong>${n}</strong><span>${I18N.t(k)}</span></div>`).join("");

    /* Reprendre */
    const last = store.get("lms-last", null);
    const lc = last && COURSES.find(c => c.id === last.courseId);
    $("#continue").innerHTML = lc && pct(lc) < 100 ? `
      <div class="resume" style="--c1:${lc.c1};--c2:${lc.c2}">
        <div>
          <small>${I18N.t("home.continue")}</small>
          <h3>${lc.icon} ${I18N.pick(lc.title)}</h3>
          <div class="progress light"><div class="progress-fill" style="width:${pct(lc)}%"></div></div>
        </div>
        <a class="btn btn-light" href="${ROOT}pages/course.html?id=${lc.id}">${I18N.t("home.resume")}</a>
      </div>` : "";

    /* Matières */
    $("#cat-grid").innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => {
      const n = COURSES.filter(c => c.cat === key).length;
      return `<a class="cat-card" href="${ROOT}pages/courses.html?cat=${key}">
        <span class="cat-icon">${cat.icon}</span>
        <strong>${I18N.pick(cat.name)}</strong>
        <small>${n} ${I18N.t("stat.courses").toLowerCase()}</small></a>`;
    }).join("");

    $("#featured").innerHTML = COURSES.slice(0, 6).map(courseCard).join("");
  }

  /* ===== Catalogue ===== */
  const filters = { cat: new URLSearchParams(location.search).get("cat") || "all", q: "", level: "all" };

  function renderCourses() {
    document.title = I18N.t("nav.courses") + " - EduLearn";

    $("#chips").innerHTML =
      `<button class="chip ${filters.cat === "all" ? "active" : ""}" data-cat="all">${I18N.t("courses.all")}</button>` +
      Object.entries(CATEGORIES).map(([k, c]) =>
        `<button class="chip ${filters.cat === k ? "active" : ""}" data-cat="${k}">${c.icon} ${I18N.pick(c.name)}</button>`).join("");

    const lvl = $("#level-filter");
    lvl.innerHTML = ["all", "beginner", "intermediate", "advanced"]
      .map(l => `<option value="${l}">${I18N.t("level." + l)}</option>`).join("");
    lvl.value = filters.level;

    const list = COURSES.filter(c =>
      (filters.cat === "all" || c.cat === filters.cat) &&
      (filters.level === "all" || c.level === filters.level) &&
      (I18N.pick(c.title) + " " + I18N.pick(c.desc)).toLowerCase().includes(filters.q.toLowerCase()));

    $("#course-grid").innerHTML = list.map(courseCard).join("");
    $("#empty").hidden = list.length > 0;

    $$(".chip").forEach(b => b.onclick = () => { filters.cat = b.dataset.cat; renderCourses(); I18N.apply(); });
    lvl.onchange = e => { filters.level = e.target.value; renderCourses(); I18N.apply(); };
    $("#search").oninput = e => { filters.q = e.target.value; renderCoursesList(); };
  }

  /* Rafraîchit seulement la grille (garde le focus dans la barre de recherche) */
  function renderCoursesList() {
    const list = COURSES.filter(c =>
      (filters.cat === "all" || c.cat === filters.cat) &&
      (filters.level === "all" || c.level === filters.level) &&
      (I18N.pick(c.title) + " " + I18N.pick(c.desc)).toLowerCase().includes(filters.q.toLowerCase()));
    $("#course-grid").innerHTML = list.map(courseCard).join("");
    $("#empty").hidden = list.length > 0;
  }
  /* ===== Vidéo d'une leçon =====
     Priorité : vidéo de la leçon > vidéo du cours.
     Formats : "ID" | "ID@120" (début à 120 s) | "video.mp4" (fichier local dans /images) */
  function videoHTML(c, lesson) {
    const v = lesson.video || c.video || "";
    if (!v) {
      return `<div class="video-box"><div class="video-ph"><span>▶</span><small>${I18N.t("course.novideo")}</small></div></div>`;
    }
    if (/\.(mp4|webm)$/i.test(v)) {
      return `<div class="video-box"><video controls preload="metadata" src="${ROOT}images/${v}"></video></div>`;
    }
    const [id, t] = v.split("@");
    const start = parseInt(t, 10) || 0;
    return `
      <div class="video-box">
        <iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0${start ? "&start=" + start : ""}"
          title="${I18N.pick(lesson.title)}" loading="lazy" allowfullscreen
          allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"></iframe>
      </div>
      <p class="video-credit small muted">🎬
        <a href="https://www.youtube.com/watch?v=${id}${start ? "&t=" + start + "s" : ""}" target="_blank" rel="noopener">${I18N.t("course.openyt")}</a>
      </p>`;
  }
  /* ===== Lecteur de cours ===== */
  let currentIdx = null;

  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function renderCourse() {
    const id = new URLSearchParams(location.search).get("id");
    const c = COURSES.find(x => x.id === id);
    const root = $("#course-root");

    if (!c) { root.innerHTML = `<p class="empty">${I18N.t("course.notfound")}</p>`; return; }

    if (currentIdx === null) {
      const last = store.get("lms-last", null);
      currentIdx = last && last.courseId === id ? Math.min(last.idx, c.lessons.length - 1) : 0;
    }
    const idx = currentIdx;
    const done = doneOf(id);
    const lesson = c.lessons[idx];
    const p = pct(c);
    document.title = I18N.pick(c.title) + " - EduLearn";
    store.set("lms-last", { courseId: id, idx });

    root.innerHTML = `
      <div class="course-layout" style="--c1:${c.c1};--c2:${c.c2}">
        <aside class="sidebar">
          <a class="back" href="${ROOT}pages/courses.html">${I18N.t("course.back")}</a>
          <div class="side-head"><span>${c.icon}</span><h2>${I18N.pick(c.title)}</h2></div>
          <div class="progress"><div class="progress-fill" style="width:${p}%"></div></div>
          <p class="muted small">${p}% ${I18N.t("course.progress")}</p>
          <ol class="lesson-list">
            ${c.lessons.map((l, i) => `
              <li><button data-i="${i}" class="${i === idx ? "active" : ""} ${done.includes(i) ? "completed" : ""}">
                <span class="num">${done.includes(i) ? "✔" : i + 1}</span>
                <span>${I18N.pick(l.title)}</span>
              </button></li>`).join("")}
          </ol>
        </aside>

        <article class="lesson">
          <div class="crumbs">${CATEGORIES[c.cat].icon} ${I18N.pick(CATEGORIES[c.cat].name)} · ${I18N.t("course.lesson")} ${idx + 1}/${c.lessons.length}</div>
          <h1>${I18N.pick(lesson.title)}</h1>

           ${videoHTML(c, lesson)}

          <div class="prose">${lessonBody(lesson)}</div>
          <div class="lesson-actions">
            <button class="btn btn-outline" id="prev" ${idx === 0 ? "disabled" : ""}>${I18N.t("course.prev")}</button>
            <button class="btn btn-success ${done.includes(idx) ? "is-done" : ""}" id="done">
              ${done.includes(idx) ? I18N.t("course.undo") : I18N.t("course.done")}</button>
            <button class="btn" id="next" ${idx === c.lessons.length - 1 ? "disabled" : ""}>${I18N.t("course.next")}</button>
          </div>
        </article>
      </div>`;

    $$(".lesson-list button").forEach(b => b.onclick = () => go(+b.dataset.i));
    $("#prev").onclick = () => go(idx - 1);
    $("#next").onclick = () => go(idx + 1);
    $("#done").onclick = () => {
      const all = allProgress();
      const list = new Set(all[id] || []);
      if (list.has(idx)) list.delete(idx); else list.add(idx);
      all[id] = [...list];
      store.set("lms-progress", all);
      if (list.has(idx)) {
        if (list.size === c.lessons.length) toast(I18N.t("course.completed"));
        else if (idx < c.lessons.length - 1) { go(idx + 1); return; }
      }
      renderCourse(); I18N.apply();
    };

    function go(i) {
      currentIdx = i;
      renderCourse(); I18N.apply();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* ===== Démarrage ===== */
  function boot() {
    I18N.setDir();
    renderLayout();
    if (PAGE === "home") renderHome();
    if (PAGE === "courses") renderCourses();
    if (PAGE === "course") renderCourse();
    I18N.apply();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
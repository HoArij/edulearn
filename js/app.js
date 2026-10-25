(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const t = k => I18N.t(k);
  const tr = o => esc(I18N.pick(o));              // texte traduit + échappé

  /* ===== Stockage ===== */
  const store = {
    get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };
  const KEYS = {
    
    progress: "lms-progress", last: "lms-last", quiz: "lms-quiz",
    custom: "lms-custom", hidden: "lms-hidden"
  };
  let videoTimer = null;

  /* ===== Cours (de base + ajoutés par l'admin - supprimés) ===== */
  const BASE = COURSES;
  const courses = () => {
    const hidden = store.get(KEYS.hidden, []);
    return [...BASE.filter(c => !hidden.includes(c.id)), ...store.get(KEYS.custom, [])];
  };
  const getCourse = id => courses().find(c => c.id === id);
  const catOf = c => CATEGORIES[c.cat] || CATEGORIES.prog;

  /* ===== Progression ===== */
  const allProgress = () => store.get(KEYS.progress, {});
  const doneOf = id => allProgress()[id] || [];
  const pct = c => c.lessons.length
    ? Math.round(doneOf(c.id).filter(i => i < c.lessons.length).length / c.lessons.length * 100) : 0;
  const lessonBody = l => (typeof l.body === "string" ? l.body : I18N.pick(l.body));
  const quizOf = c => c.quiz || [];
  const quizResult = id => store.get(KEYS.quiz, {})[id];

  /* ===== Thème ===== */
  document.documentElement.dataset.theme = localStorage.getItem("lms-theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const setTheme = th => {
    document.documentElement.dataset.theme = th;
    localStorage.setItem("lms-theme", th);
    const b = $("#theme-btn");
    if (b) b.textContent = th === "dark" ? "☀️" : "🌙";
  };

  /* ===== Toast ===== */
  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  /* ===== Header / Footer ===== */
  function renderLayout() {
    $("#site-header").innerHTML = `
      <div class="container nav-wrap">
        <a class="logo" href="#/"><span class="logo-mark">E</span>Edu<b>Learn</b></a>
        <nav class="main-nav" id="nav" aria-label="Navigation">
          <a href="#/" data-nav="home" data-i18n="nav.home"></a>
          <a href="#/courses" data-nav="courses" data-i18n="nav.courses"></a>
          <a href="#/admin" data-nav="admin" data-i18n="nav.admin"></a>
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
    $("#lang-select").addEventListener("change", e => { I18N.set(e.target.value); boot(true); });
    $("#theme-btn").addEventListener("click", () =>
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
    $("#burger").addEventListener("click", e => {
      const open = $("#nav").classList.toggle("open");
      e.currentTarget.classList.toggle("open", open);
      e.currentTarget.setAttribute("aria-expanded", open);
    });
    $("#nav").addEventListener("click", () => {      // ferme le menu mobile après un clic
      $("#nav").classList.remove("open");
      $("#burger").classList.remove("open");
      $("#burger").setAttribute("aria-expanded", "false");
    });
    setTheme(document.documentElement.dataset.theme);
  }

  function setActiveNav(name) {
    $$("#nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === name));
  }

  /* ===== Carte de cours ===== */
  function courseCard(c) {
    const p = pct(c);
    const label = p === 100 ? t("review") : p > 0 ? t("continue") : t("start");
    const qr = quizResult(c.id);
    return `
      <article class="card" style="--c1:${c.c1};--c2:${c.c2}">
        <div class="card-cover">
          <span class="card-icon">${esc(c.icon)}</span>
          <span class="badge">${t("level." + c.level)}</span>
        </div>
        <div class="card-body">
          <span class="cat">${catOf(c).icon} ${tr(catOf(c).name)}</span>
          <h3>${tr(c.title)}</h3>
          <p>${tr(c.desc)}</p>
          <div class="meta">
            <span>📚 ${c.lessons.length} ${t("lessons")}</span><span>⏱ ${esc(c.hours)}h</span>
            ${qr ? `<span>🏆 ${qr.best}/${qr.total}</span>` : ""}
          </div>
          <div class="progress"><div class="progress-fill" style="width:${p}%"></div></div>
          <div class="card-foot">
            <span class="pct">${p}%</span>
            <a class="btn btn-sm" href="#/course/${encodeURIComponent(c.id)}">${label}</a>
          </div>
        </div>
      </article>`;
  }

  /* ===================== ACCUEIL ===================== */
  function renderHome(view) {
    document.title = "EduLearn";
    const list = courses();
    const totalLessons = list.reduce((s, c) => s + c.lessons.length, 0);
    const totalHours = list.reduce((s, c) => s + (Number(c.hours) || 0), 0);
    const done = list.reduce((s, c) => s + doneOf(c.id).filter(i => i < c.lessons.length).length, 0);

    const stats = [[list.length, "stat.courses"], [totalLessons, "stat.lessons"],
      [totalHours + "h", "stat.hours"], [done, "stat.done"]]
      .map(([n, k]) => `<div class="stat"><strong>${n}</strong><span>${t(k)}</span></div>`).join("");

    const last = store.get(KEYS.last, null);
    const lc = last && getCourse(last.courseId);
    const resume = lc && pct(lc) < 100 ? `
      <div class="resume" style="--c1:${lc.c1};--c2:${lc.c2}">
        <div>
          <small>${t("home.continue")}</small>
          <h3>${esc(lc.icon)} ${tr(lc.title)}</h3>
          <div class="progress light"><div class="progress-fill" style="width:${pct(lc)}%"></div></div>
        </div>
        <a class="btn btn-light" href="#/course/${encodeURIComponent(lc.id)}">${t("home.resume")}</a>
      </div>` : "";

    const cats = Object.entries(CATEGORIES).map(([key, cat]) => {
      const n = list.filter(c => c.cat === key).length;
      return `<a class="cat-card" href="#/courses?cat=${key}">
        <span class="cat-icon">${cat.icon}</span>
        <strong>${tr(cat.name)}</strong>
        <small>${n} ${t("stat.courses").toLowerCase()}</small></a>`;
    }).join("");

    view.innerHTML = `
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-text">
            <span class="pill" data-i18n="hero.badge"></span>
            <h1 data-i18n="hero.title"></h1>
            <p data-i18n="hero.sub"></p>
            <div class="hero-actions">
              <a class="btn btn-lg" href="#/courses" data-i18n="hero.cta1"></a>
              <a class="btn btn-lg btn-ghost" href="#/" data-scroll="categories" data-i18n="hero.cta2"></a>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="blob"></div>
            <div class="float-card fc1">💻 <b>HTML & CSS</b></div>
            <div class="float-card fc2">🐍 <b>Python</b></div>
            <div class="float-card fc3">🤖 <b>IA</b></div>
            <div class="float-card fc4">🗄️ <b>SQL</b></div>
          </div>
        </div>
      </section>

      <div class="container"><div class="stats">${stats}</div></div>
      <div class="container">${resume}</div>

      <section class="container section" id="categories">
        <div class="section-head"><h2 data-i18n="home.cats"></h2></div>
        <div class="cat-grid">${cats}</div>
      </section>

      <section class="container section">
        <div class="section-head">
          <h2 data-i18n="home.featured"></h2>
          <a class="link" href="#/courses" data-i18n="home.viewAll"></a>
        </div>
        <div class="grid">${list.slice(0, 6).map(courseCard).join("")}</div>
      </section>

      <section class="container section">
        <div class="section-head"><h2 data-i18n="home.why"></h2></div>
        <div class="features">
          <div class="feature"><span aria-hidden="true">🎯</span><h3 data-i18n="f1.t"></h3><p data-i18n="f1.d"></p></div>
          <div class="feature"><span aria-hidden="true">📈</span><h3 data-i18n="f2.t"></h3><p data-i18n="f2.d"></p></div>
          <div class="feature"><span aria-hidden="true">🌍</span><h3 data-i18n="f3.t"></h3><p data-i18n="f3.d"></p></div>
        </div>
      </section>`;
  }

  /* ===================== CATALOGUE ===================== */
  function renderCourses(view, params) {
    const f = { cat: params.get("cat") || "all", q: "", level: "all" };
    document.title = t("nav.courses") + " - EduLearn";

    view.innerHTML = `
      <div class="container page">
        <div class="page-head">
          <h1 data-i18n="courses.title"></h1>
          <p class="muted" data-i18n="courses.sub"></p>
        </div>
        <div class="toolbar">
          <input type="search" id="search" data-i18n-placeholder="courses.search" aria-label="Search">
          <select id="level-filter" aria-label="Level">
            ${["all", "beginner", "intermediate", "advanced"].map(l => `<option value="${l}">${t("level." + l)}</option>`).join("")}
          </select>
        </div>
        <div class="chips" id="chips" role="tablist"></div>
        <div class="grid" id="course-grid"></div>
        <p class="empty" id="empty" hidden data-i18n="courses.none"></p>
      </div>`;

    const paintChips = () => {
      $("#chips").innerHTML =
        `<button class="chip ${f.cat === "all" ? "active" : ""}" data-cat="all">${t("courses.all")}</button>` +
        Object.entries(CATEGORIES).map(([k, c]) =>
          `<button class="chip ${f.cat === k ? "active" : ""}" data-cat="${k}">${c.icon} ${tr(c.name)}</button>`).join("");
      $$(".chip").forEach(b => b.onclick = () => { f.cat = b.dataset.cat; paintChips(); paintGrid(); });
    };
    const paintGrid = () => {
      const q = f.q.toLowerCase();
      const list = courses().filter(c =>
        (f.cat === "all" || c.cat === f.cat) &&
        (f.level === "all" || c.level === f.level) &&
        (I18N.pick(c.title) + " " + I18N.pick(c.desc)).toLowerCase().includes(q));
      $("#course-grid").innerHTML = list.map(courseCard).join("");
      $("#empty").hidden = list.length > 0;
    };

    $("#level-filter").onchange = e => { f.level = e.target.value; paintGrid(); };
    $("#search").oninput = e => { f.q = e.target.value; paintGrid(); };
    paintChips(); paintGrid();
  }

  /* ===================== VIDÉO ===================== */
  /* Formats : "ID" | "ID@120" (début à 120 s) | "ID&list=PL..." | "video.mp4" (dans /images) */
  function videoHTML(c, lesson) {
    const v = lesson.video || c.video || "";
    if (!v) {
      return `<div class="video-box"><div class="video-ph"><span>▶</span><small>${t("course.novideo")}</small></div></div>`;
    }
    if (/\.(mp4|webm)$/i.test(v)) {
    return `<div class="video-box"><video id="lesson-video" controls preload="metadata" src="images/${esc(v)}"></video></div>`;    }
    const [idPart, ts] = v.split("@");
    const id = idPart.split("&")[0];
    const list = (/list=([\w-]+)/.exec(idPart) || [])[1];
    const start = parseInt(ts, 10) || 0;
    const q = "rel=0&enablejsapi=1" + (list ? "&list=" + list : "") + (start ? "&start=" + start : "");    return `
      <div class="video-box">
    <iframe id="yt-frame" src="https://www.youtube-nocookie.com/embed/${esc(id)}?${q}"          title="${tr(lesson.title)}" loading="lazy" allowfullscreen
          allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"></iframe>
      </div>
      <p class="video-credit small muted">🎬
        <a href="https://www.youtube.com/watch?v=${esc(id)}${start ? "&t=" + start + "s" : ""}" target="_blank" rel="noopener">${t("course.openyt")}</a>
      </p>`;
  }

  /* ===================== LECTEUR DE COURS ===================== */
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const videoState = () => store.get("lms-video", {});
  const hasVideo = (c, l) => !!(l.video || c.video);

  const videoBarHTML = () => `
    <div class="video-progress">
      <div class="vbar"><div class="vbar-fill" id="vbar-fill"></div></div>
      <div class="vbar-info">
        <small class="muted" id="vbar-label"></small>
        <button type="button" class="btn btn-sm btn-outline" id="vresume" hidden></button>
      </div>
    </div>`;

  function paintVideoBar(p) {
    const f = $("#vbar-fill"), l = $("#vbar-label");
    if (f) f.style.width = p + "%";
    if (l) l.textContent = `${p}% ${t("video.watched")}`;
  }

  function autoMark(c, idx) {
    const all = allProgress();
    const set = new Set(all[c.id] || []);
    if (set.has(idx)) return;
    set.add(idx);
    all[c.id] = [...set];
    store.set(KEYS.progress, all);
    const m = $$(".marker")[idx]; if (m) m.classList.add("done");
    const a = $$(".lesson-link")[idx];
    if (a) { a.classList.add("completed"); $(".num", a).textContent = "✔"; }
    toast("✅ " + t("video.auto"));
  }

  function onVideoProgress(c, idx, cur, dur) {
    if (!dur || !isFinite(dur)) return;
    const s = videoState();
    s[`${c.id}:${idx}`] = { t: Math.floor(cur), d: Math.floor(dur) };
    store.set("lms-video", s);
    const p = Math.min(100, Math.round(cur / dur * 100));
    paintVideoBar(p);
    if (p >= 90) autoMark(c, idx);
  }

  let ytReady = null;
  const loadYT = () => ytReady || (ytReady = new Promise(res => {
    if (window.YT && YT.Player) return res();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); res(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }));

  function initVideo(c, idx) {
    if (!hasVideo(c, c.lessons[idx])) return;
    const saved = videoState()[`${c.id}:${idx}`];
    paintVideoBar(saved && saved.d ? Math.min(100, Math.round(saved.t / saved.d * 100)) : 0);

    const btn = $("#vresume");
    const showResume = fn => {
      if (!saved || saved.t < 5 || !btn) return;
      btn.textContent = `⏯ ${t("video.resume")} ${mmss(saved.t)}`;
      btn.hidden = false;
      btn.onclick = fn;
    };

    const vid = $("#lesson-video");
    if (vid) {                                             // fichier local
      vid.addEventListener("timeupdate", () => onVideoProgress(c, idx, vid.currentTime, vid.duration));
      showResume(() => { vid.currentTime = saved.t; vid.play(); });
      return;
    }
    if (!$("#yt-frame")) return;
    loadYT().then(() => {                                  // YouTube
      if (!$("#yt-frame")) return;                         // l'utilisateur a changé de page entre-temps
      const player = new YT.Player("yt-frame", {
        events: {
          onReady: () => showResume(() => { player.seekTo(saved.t, true); player.playVideo(); }),
          onStateChange: e => {
            clearInterval(videoTimer);
            if (e.data === YT.PlayerState.PLAYING) {
              videoTimer = setInterval(() =>
                onVideoProgress(c, idx, player.getCurrentTime(), player.getDuration()), 1000);
            }
          }
        }
      });
    });
  }
  function sidebar(c, idx, quizMode) {
    const done = doneOf(c.id);
    const p = pct(c);
    const qr = quizResult(c.id);

    return `
      <aside class="sidebar">
        <a class="back" href="#/courses">${t("course.back")}</a>
        <div class="side-head"><span>${esc(c.icon)}</span><h2>${tr(c.title)}</h2></div>
        <div class="progress"><div class="progress-fill" style="width:${p}%"></div></div>
        <p class="muted small">${p}% ${t("course.progress")}</p>
        <ol class="lesson-list">
          ${c.lessons.map((l, i) => `
            <li><a class="lesson-link ${!quizMode && i === idx ? "active" : ""} ${done.includes(i) ? "completed" : ""}"
                   href="#/course/${encodeURIComponent(c.id)}/${i}">
              <span class="num">${done.includes(i) ? "✔" : i + 1}</span>
              <span>${tr(l.title)}</span>
            </a></li>`).join("")}
        </ol>
        ${quizOf(c).length ? `
          <a class="side-quiz ${quizMode ? "active" : ""}" href="#/course/${encodeURIComponent(c.id)}/quiz">
            <span aria-hidden="true">🧠</span><span>${t("course.quiz")}</span>
            ${qr ? `<small class="muted">${qr.best}/${qr.total}</small>` : ""}
          </a>` : ""}
      </aside>`;
  }

  function renderCourse(view, id, sub) {
    const c = getCourse(id);
    if (!c) {
      view.innerHTML = `<div class="container page"><p class="empty">${t("course.notfound")}</p>
        <p style="text-align:center"><a class="btn" href="#/courses">${t("course.back")}</a></p></div>`;
      return;
    }
    const quizMode = sub === "quiz" && quizOf(c).length > 0;
    const len = c.lessons.length;
    const enc = encodeURIComponent(c.id);
    document.title = I18N.pick(c.title) + " - EduLearn";

    let idx = 0;
    if (!quizMode) {
      if (sub === undefined || sub === "quiz") {            // reprise automatique
        const last = store.get(KEYS.last, null);
        idx = last && last.courseId === id ? last.idx : 0;
        history.replaceState(null, "", `#/course/${enc}/${Math.min(Math.max(idx, 0), len - 1)}`);
      } else idx = parseInt(sub, 10) || 0;
      idx = Math.min(Math.max(idx, 0), len - 1);
      store.set(KEYS.last, { courseId: id, idx });          // sauvegarde de la position
    }

    let main;
    if (quizMode) {
      main = `<article class="lesson"><div id="quiz-box"></div></article>`;
    } else {
      const lesson = c.lessons[idx];
      const done = doneOf(id);
      const hasQuiz = quizOf(c).length > 0;
      const nextIsQuiz = idx === len - 1 && hasQuiz;
      main = `
        <article class="lesson">
          <div class="crumbs">${catOf(c).icon} ${tr(catOf(c).name)} · ${t("course.lesson")} ${idx + 1}/${len}</div>
          <h1>${tr(lesson.title)}</h1>
          <div class="markers" role="list">
            ${c.lessons.map((l, i) => `<a role="listitem" class="marker ${done.includes(i) ? "done" : ""} ${i === idx ? "current" : ""}"
              href="#/course/${enc}/${i}" title="${tr(l.title)}" aria-label="${tr(l.title)}"></a>`).join("")}
          </div>
          ${videoHTML(c, lesson)}
          ${hasVideo(c, lesson) ? videoBarHTML() : ""}
          <div class="prose">${lessonBody(lesson)}</div>
          <div class="lesson-actions">
            <button class="btn btn-outline" id="prev" ${idx === 0 ? "disabled" : ""}>${t("course.prev")}</button>
            <button class="btn btn-success ${done.includes(idx) ? "is-done" : ""}" id="done">
              ${done.includes(idx) ? t("course.undo") : t("course.done")}</button>
            <button class="btn" id="next" ${idx === len - 1 && !hasQuiz ? "disabled" : ""}>
              ${nextIsQuiz ? "🧠 " + t("course.quiz") : t("course.next")}</button>
          </div>
        </article>`;
    }

    view.innerHTML = `<div class="container page"><div class="course-layout" style="--c1:${c.c1};--c2:${c.c2}">
      ${sidebar(c, idx, quizMode)}${main}</div></div>`;

    if (quizMode) { renderQuiz($("#quiz-box"), c); return; }
      initVideo(c, idx);

    $("#prev").onclick = () => { location.hash = `#/course/${enc}/${idx - 1}`; };
    $("#next").onclick = () => {
      location.hash = idx === len - 1 ? `#/course/${enc}/quiz` : `#/course/${enc}/${idx + 1}`;
    };
    $("#done").onclick = () => {
      const all = allProgress();
      const set = new Set(all[id] || []);
      const wasDone = set.has(idx);
      if (wasDone) set.delete(idx); else set.add(idx);
      all[id] = [...set];
      store.set(KEYS.progress, all);
      if (!wasDone) {
        if (set.size >= len) toast(t("course.completed"));
        else if (idx < len - 1) { location.hash = `#/course/${enc}/${idx + 1}`; return; }
      }
      render(true);
    };
  }

  /* ===================== QUIZ ===================== */
  function renderQuiz(box, c) {
    const qs = quizOf(c);
    const enc = encodeURIComponent(c.id);
    const st = { i: 0, score: 0, answered: false };

    const paint = () => {
      if (st.i >= qs.length) return finish();
      const q = qs[st.i];
      box.innerHTML = `
        <div class="quiz">
          <div class="quiz-head">
            <h1>🧠 ${t("quiz.title")}</h1>
            <span class="muted">${t("quiz.question")} ${st.i + 1}/${qs.length}</span>
          </div>
          <div class="progress"><div class="progress-fill" style="width:${Math.round(st.i / qs.length * 100)}%"></div></div>
          <h2 class="quiz-q">${tr(q.q)}</h2>
          <div class="quiz-options" role="group" aria-label="${t("quiz.title")}">
            ${q.options.map((o, k) => `<button type="button" class="quiz-opt" data-k="${k}">${tr(o)}</button>`).join("")}
          </div>
          <div class="quiz-feedback" id="qf" role="status" aria-live="polite"></div>
          <div class="lesson-actions"><button class="btn" id="qnext" hidden></button></div>
        </div>`;

      $$(".quiz-opt", box).forEach(b => b.onclick = () => {
        if (st.answered) return;
        st.answered = true;
        const k = +b.dataset.k;
        const ok = k === q.answer;
        if (ok) st.score++;
        $$(".quiz-opt", box).forEach((x, j) => {
          x.disabled = true;
          if (j === q.answer) x.classList.add("correct");
          else if (j === k) x.classList.add("wrong");
        });
        const fb = $("#qf");
        fb.className = "quiz-feedback " + (ok ? "ok" : "ko");
        fb.innerHTML = `<strong>${ok ? "✅ " + t("quiz.correct") : "❌ " + t("quiz.wrong")}</strong> ${q.exp ? tr(q.exp) : ""}`;
        const n = $("#qnext");
        n.textContent = st.i === qs.length - 1 ? t("quiz.finish") : t("quiz.next");
        n.hidden = false;
        n.focus();
      });
      $("#qnext").onclick = () => { st.i++; st.answered = false; paint(); };
    };

    const finish = () => {
      const res = store.get(KEYS.quiz, {});
      const prev = res[c.id];
      res[c.id] = { last: st.score, best: Math.max(prev ? prev.best : 0, st.score), total: qs.length };
      store.set(KEYS.quiz, res);
      const p = Math.round(st.score / qs.length * 100);
      const msg = p === 100 ? "quiz.perfect" : p >= 50 ? "quiz.good" : "quiz.again";
      box.innerHTML = `
        <div class="quiz quiz-result">
          <h1>🏁 ${t("quiz.title")}</h1>
          <div class="quiz-score">${st.score}/${qs.length}</div>
          <p>${p}% - ${t(msg)}</p>
          <p class="muted small">${t("quiz.best")} : ${res[c.id].best}/${qs.length}</p>
          <div class="lesson-actions">
            <button class="btn btn-outline" id="qretry">🔄 ${t("quiz.retry")}</button>
            <a class="btn" href="#/course/${enc}/0">${t("quiz.backcourse")}</a>
          </div>
        </div>`;
      toast(`${t("quiz.score")} : ${st.score}/${qs.length}`);
      $("#qretry").onclick = () => { Object.assign(st, { i: 0, score: 0, answered: false }); paint(); };
    };

    paint();
  }

  /* ===================== ADMIN ===================== */
  const PALETTES = [["#f97316", "#ef4444"], ["#0ea5e9", "#6366f1"], ["#22c55e", "#0ea5e9"],
    ["#8b5cf6", "#ec4899"], ["#14b8a6", "#6366f1"], ["#eab308", "#f97316"]];
  const toBody = txt => `<p>${esc(txt).replace(/\n/g, "<br>")}</p>`;

  /* Ligne leçon : Titre | Contenu | vidéo (optionnel) */
  function parseLessons(text) {
    return text.split("\n").map(l => l.trim()).filter(Boolean).map(line => {
      const [title, body = "", video = ""] = line.split("|").map(s => s.trim());
      return { title, body: toBody(body || title), video };
    }).filter(l => l.title);
  }
  /* Ligne quiz : Question | Rép1 ; Rép2 ; Rép3 | n° de la bonne (1..) | Explication (optionnel) */
  function parseQuiz(text) {
    return text.split("\n").map(l => l.trim()).filter(Boolean).map(line => {
      const [q, opts = "", ans = "1", exp = ""] = line.split("|").map(s => s.trim());
      const options = opts.split(";").map(s => s.trim()).filter(Boolean);
      const answer = (parseInt(ans, 10) || 1) - 1;
      return { q, options, answer, exp };
    }).filter(x => x.q && x.options.length >= 2 && x.answer >= 0 && x.answer < x.options.length);
  }

  function renderAdmin(view) {
    document.title = t("nav.admin") + " - EduLearn";
    const hidden = store.get(KEYS.hidden, []);
    const custom = store.get(KEYS.custom, []);
    const list = courses();

    view.innerHTML = `
      <div class="container page">
        <div class="page-head">
          <h1>⚙️ ${t("admin.title")}</h1>
          <p class="muted">${t("admin.sub")}</p>
        </div>

        <div class="admin-grid">
          <section class="admin-card">
            <h2>➕ ${t("admin.add")}</h2>
            <form id="course-form" class="admin-form" novalidate>
              <label>${t("admin.f.title")}<input type="text" id="f-title" required></label>
              <label>${t("admin.f.desc")}<input type="text" id="f-desc"></label>
              <div class="admin-row">
                <label>${t("admin.f.cat")}
                  <select id="f-cat">${Object.entries(CATEGORIES).map(([k, c]) => `<option value="${k}">${c.icon} ${tr(c.name)}</option>`).join("")}</select></label>
                <label>${t("admin.f.level")}
                  <select id="f-level">${["beginner", "intermediate", "advanced"].map(l => `<option value="${l}">${t("level." + l)}</option>`).join("")}</select></label>
              </div>
              <div class="admin-row">
                <label>${t("admin.f.hours")}<input type="number" id="f-hours" min="1" value="2"></label>
                <label>${t("admin.f.icon")}<input type="text" id="f-icon" maxlength="4" value="📘"></label>
              </div>
              <label>${t("admin.f.lessons")}
                <textarea id="f-lessons" rows="5" placeholder="Intro | Contenu de la leçon | dQw4w9WgXcQ"></textarea></label>
              <small class="muted">${t("admin.help.lessons")}</small>
              <label>${t("admin.f.quiz")}
                <textarea id="f-quiz" rows="4" placeholder="2 + 2 = ? | 3 ; 4 ; 5 | 2 | 2 + 2 vaut 4"></textarea></label>
              <small class="muted">${t("admin.help.quiz")}</small>
              <p class="form-error" id="f-error" role="alert" hidden></p>
              <button class="btn" type="submit">${t("admin.save")}</button>
            </form>
          </section>

          <section class="admin-card">
            <h2>📚 ${t("admin.list")} (${list.length})</h2>
            <ul class="admin-list">
              ${list.map(c => `
                <li>
                  <span class="admin-ico">${esc(c.icon)}</span>
                  <div class="admin-info">
                    <strong>${tr(c.title)}</strong>
                    <small class="muted">${c.lessons.length} ${t("lessons")} · ${quizOf(c).length} ${t("admin.questions")}
                      ${String(c.id).startsWith("c-") ? ` · <span class="tag-custom">${t("admin.custom")}</span>` : ""}</small>
                  </div>
                  <button class="btn btn-sm btn-outline" data-del="${esc(c.id)}">🗑 ${t("admin.delete")}</button>
                </li>`).join("") || `<li class="muted">${t("courses.none")}</li>`}
            </ul>
            <div class="admin-actions">
              ${hidden.length ? `<button class="btn btn-sm btn-outline" id="restore">↩ ${t("admin.restore")} (${hidden.length})</button>` : ""}
              <button class="btn btn-sm btn-outline" id="reset-progress">🔄 ${t("admin.resetprogress")}</button>
            </div>
          </section>
        </div>
      </div>`;

    $("#course-form").onsubmit = e => {
      e.preventDefault();
      const title = $("#f-title").value.trim();
      const lessons = parseLessons($("#f-lessons").value);
      const err = $("#f-error");
      if (!title || !lessons.length) { err.textContent = t("admin.invalid"); err.hidden = false; return; }
      const [c1, c2] = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const course = {
        id: "c-" + Date.now().toString(36),
        cat: $("#f-cat").value, level: $("#f-level").value,
        hours: Math.max(1, parseInt($("#f-hours").value, 10) || 1),
        icon: $("#f-icon").value.trim() || "📘", c1, c2,
        title, desc: $("#f-desc").value.trim(),
        lessons, quiz: parseQuiz($("#f-quiz").value)
      };
      store.set(KEYS.custom, [...custom, course]);
      toast(t("admin.saved"));
      renderAdmin(view); I18N.apply();
    };

    $$("[data-del]").forEach(b => b.onclick = () => {
      if (!confirm(t("admin.confirm"))) return;
      const id = b.dataset.del;
      if (custom.some(c => c.id === id)) store.set(KEYS.custom, custom.filter(c => c.id !== id));
      else store.set(KEYS.hidden, [...hidden, id]);
      const all = allProgress(); delete all[id]; store.set(KEYS.progress, all);
      renderAdmin(view); I18N.apply();
    });

    const restore = $("#restore");
    if (restore) restore.onclick = () => { store.set(KEYS.hidden, []); renderAdmin(view); I18N.apply(); };

    $("#reset-progress").onclick = () => {
      if (!confirm(t("admin.confirm"))) return;
      [KEYS.progress, KEYS.last, KEYS.quiz].forEach(k => localStorage.removeItem(k));
      toast(t("admin.saved"));
      renderAdmin(view); I18N.apply();
    };
  }

  /* ===================== ROUTEUR ===================== */
  function render(keepScroll = false) {
    
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    const params = new URLSearchParams(qs || "");
    const view = $("#view");
    const [name, id, sub] = parts;
    clearInterval(videoTimer);
    let active = "home";
    if (name === "courses") { active = "courses"; renderCourses(view, params); }
    else if (name === "course") { active = "courses"; renderCourse(view, id, sub); }
    else if (name === "admin") { active = "admin"; renderAdmin(view); }
    else renderHome(view);

    setActiveNav(active);
    I18N.apply();
    if (!keepScroll) window.scrollTo({ top: 0 });
  }

  /* ===== Démarrage ===== */
  function boot(keepScroll = false) {
    I18N.setDir();
    renderLayout();
    render(keepScroll);
  }

  document.addEventListener("click", e => {          // bouton « Voir les matières »
    const a = e.target.closest("[data-scroll]");
    if (!a) return;
    e.preventDefault();
    const el = document.getElementById(a.dataset.scroll);
    if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  window.addEventListener("hashchange", () => render());
  document.addEventListener("DOMContentLoaded", () => boot());
})();
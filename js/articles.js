(function () {
  const articles = window.C1_ARTICLES || [];
  const alias = window.C1_LEMMA_ALIAS || {};
  const known = {};
  (window.C1_VERBS || []).forEach(function (v) {
    v.prefixes.forEach(function (p) {
      known[p.form] = true;
    });
  });

  const listEl = document.getElementById("list");
  const detailEl = document.getElementById("detail");
  const titleEl = document.getElementById("page-title");
  const hintEl = document.getElementById("hint");
  const backLink = document.getElementById("back-link");
  const markBtn = document.getElementById("btn-marks");

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function lemmaOf(surface, explicit) {
    if (explicit) return explicit;
    if (known[surface]) return surface;
    return alias[surface] || "";
  }

  function parseDe(text) {
    const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    const parts = [];
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) parts.push({ t: text.slice(last, m.index) });
      parts.push({ t: m[1], mark: lemmaOf(m[1], m[2] || "") });
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push({ t: text.slice(last) });
    return parts;
  }

  function renderDe(text) {
    return parseDe(text)
      .map(function (p) {
        const t = escapeHtml(p.t);
        if (!p.mark) return t;
        return '<mark class="hit" data-form="' + escapeHtml(p.mark) + '">' + t + "</mark>";
      })
      .join("");
  }

  function currentArticle() {
    const id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!id) return null;
    return (
      articles.find(function (a) {
        return a.id === id;
      }) || null
    );
  }

  function updateMarkBtn() {
    markBtn.textContent = document.body.classList.contains("show-marks")
      ? "不显示目标词"
      : "显示目标词";
  }

  markBtn.addEventListener("click", function () {
    document.body.classList.toggle("show-marks");
    updateMarkBtn();
  });

  detailEl.addEventListener("click", function (e) {
    const sent = e.target.closest(".sent");
    if (!sent || !detailEl.contains(sent)) return;
    const open = sent.classList.contains("open");
    detailEl.querySelectorAll(".sent.open").forEach(function (el) {
      el.classList.remove("open");
    });
    if (!open) sent.classList.add("open");
  });

  function renderList() {
    titleEl.textContent = "阅读短文";
    backLink.href = "verbs.html";
    backLink.textContent = "← 词表";
    hintEl.hidden = false;
    markBtn.hidden = true;
    detailEl.hidden = true;
    detailEl.innerHTML = "";
    listEl.hidden = false;
    listEl.innerHTML = articles
      .map(function (a) {
        return (
          '<a class="card" href="#' +
          encodeURIComponent(a.id) +
          '">' +
          '<p class="kicker">' +
          escapeHtml(a.kicker) +
          "</p>" +
          "<h2>" +
          escapeHtml(a.title) +
          "</h2>" +
          "<p>" +
          escapeHtml(a.blurb) +
          "</p>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderDetail(a) {
    titleEl.textContent = a.title;
    backLink.href = "articles.html";
    backLink.textContent = "← 目录";
    hintEl.hidden = true;
    markBtn.hidden = false;
    listEl.hidden = true;
    listEl.innerHTML = "";
    detailEl.hidden = false;
    updateMarkBtn();
    detailEl.innerHTML =
      '<p class="verb-hint">' +
      escapeHtml(a.kicker) +
      " · 点一句看中文，不必弹窗。</p>" +
      a.sentences
        .map(function (s) {
          return (
            '<button type="button" class="sent">' +
            '<span class="sent-de">' +
            renderDe(s.de) +
            "</span>" +
            '<span class="sent-zh">' +
            escapeHtml(s.zh) +
            "</span>" +
            "</button>"
          );
        })
        .join("");
  }

  function paint() {
    document.body.classList.remove("show-marks");
    const a = currentArticle();
    if (a) renderDetail(a);
    else renderList();
  }

  window.addEventListener("hashchange", paint);
  paint();
})();

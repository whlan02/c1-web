(function () {
  const verbs = window.C1_VERBS || [];
  const listEl = document.getElementById("list");
  const detailEl = document.getElementById("detail");
  const titleEl = document.getElementById("page-title");
  const hintEl = document.getElementById("hint");
  const backLink = document.getElementById("back-link");
  const maskBtns = document.getElementById("mask-btns");
  const btnZh = document.getElementById("btn-zh");
  const btnDe = document.getElementById("btn-de");

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mask(lang, text) {
    return (
      '<span class="maskable lang-' +
      lang +
      '" data-lang="' +
      lang +
      '">' +
      escapeHtml(text) +
      "</span>"
    );
  }

  function currentVerb() {
    const id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!id) return null;
    return verbs.find(function (v) {
      return v.verb === id;
    }) || null;
  }

  function updateMaskButtons() {
    btnZh.textContent = document.body.classList.contains("hide-zh") ? "显示中文" : "隐藏中文";
    btnDe.textContent = document.body.classList.contains("hide-de") ? "显示德文" : "隐藏德文";
  }

  function clearOverrides(lang) {
    document.querySelectorAll(".lang-" + lang).forEach(function (el) {
      el.classList.remove("revealed", "solo-hide");
    });
  }

  btnZh.addEventListener("click", function () {
    document.body.classList.toggle("hide-zh");
    clearOverrides("zh");
    updateMaskButtons();
  });

  btnDe.addEventListener("click", function () {
    document.body.classList.toggle("hide-de");
    clearOverrides("de");
    updateMaskButtons();
  });

  document.addEventListener("click", function (e) {
    const el = e.target.closest(".maskable");
    if (!el) return;
    const lang = el.getAttribute("data-lang");
    const globalHide = document.body.classList.contains("hide-" + lang);
    if (globalHide) {
      el.classList.toggle("revealed");
    } else {
      el.classList.toggle("solo-hide");
    }
  });

  function renderList() {
    document.body.classList.remove("hide-zh", "hide-de");
    titleEl.textContent = "动词前缀";
    backLink.href = "index.html";
    backLink.textContent = "← 首页";
    hintEl.hidden = false;
    maskBtns.hidden = true;
    detailEl.hidden = true;
    detailEl.innerHTML = "";
    listEl.hidden = false;
    listEl.innerHTML = verbs
      .map(function (v) {
        return (
          '<a class="card verb-card" href="#' +
          encodeURIComponent(v.verb) +
          '">' +
          "<h2>" +
          escapeHtml(v.verb) +
          "</h2>" +
          "<p>" +
          escapeHtml(v.zh) +
          "</p>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderDetail(v) {
    titleEl.textContent = v.verb;
    backLink.href = "verbs.html";
    backLink.textContent = "← 词表";
    hintEl.hidden = true;
    maskBtns.hidden = false;
    listEl.hidden = true;
    listEl.innerHTML = "";
    detailEl.hidden = false;
    updateMaskButtons();

    const blocks = v.prefixes
      .map(function (p) {
        const sepText =
          p.prefix === "—"
            ? ""
            : '<span class="sep-label">' +
              (p.sep ? "可分" : "不可分") +
              "</span>";
        const meanings = p.meanings
          .map(function (m) {
            return (
              '<li><div class="meaning-de">' +
              mask("de", m.de) +
              '</div><div class="meaning-zh">' +
              mask("zh", m.zh) +
              "</div></li>"
            );
          })
          .join("");
        return (
          '<article class="prefix-card">' +
          '<header class="prefix-head">' +
          "<div>" +
          '<p class="prefix-kicker">' +
          (p.prefix === "—" ? "常用用法" : "前缀 " + escapeHtml(p.prefix)) +
          sepText +
          "</p>" +
          "<h2>" +
          mask("de", p.form) +
          "</h2>" +
          "</div>" +
          "</header>" +
          '<ul class="meaning-list">' +
          meanings +
          "</ul>" +
          "</article>"
        );
      })
      .join("");

    detailEl.innerHTML =
      '<p class="verb-base">' +
      mask("de", v.verb) +
      " · " +
      mask("zh", v.zh) +
      "</p>" +
      blocks;
  }

  function paint() {
    const v = currentVerb();
    if (v) renderDetail(v);
    else renderList();
  }

  window.addEventListener("hashchange", paint);
  paint();
})();

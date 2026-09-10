(function () {
  const params = new URLSearchParams(location.search);
  const key = params.get("doc") || "schreiben";
  const meta = window.C1_DOCS[key];

  const titleEl = document.getElementById("doc-title");
  const tocEl = document.getElementById("toc");
  const articleEl = document.getElementById("article");
  const statusEl = document.getElementById("status");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");
  const menuBtn = document.getElementById("menu-btn");

  function slugify(text, used) {
    let base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "") || "section";
    let id = base;
    let n = 2;
    while (used.has(id)) {
      id = base + "-" + n;
      n += 1;
    }
    used.add(id);
    return id;
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
  }

  menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("open");
  });
  backdrop.addEventListener("click", closeMenu);

  function setStatus(msg) {
    statusEl.hidden = !msg;
    statusEl.textContent = msg || "";
    articleEl.hidden = !!msg;
  }

  function buildTree(heads) {
    const root = { children: [], level: 0 };
    const stack = [root];
    heads.forEach(function (h) {
      const node = { text: h.text, id: h.id, level: h.level, children: [] };
      while (stack.length && stack[stack.length - 1].level >= h.level) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });
    return root.children;
  }

  function renderToc(nodes, depth) {
    const ul = document.createElement("ul");
    if (depth === 0) ul.className = "toc";
    nodes.forEach(function (node) {
      const li = document.createElement("li");
      li.className = "toc-item";
      if (node.children.length && depth >= 1) li.classList.add("collapsed");

      const row = document.createElement("div");
      row.className = "toc-row";

      const toggle = document.createElement("button");
      toggle.className = "toc-toggle";
      toggle.type = "button";
      if (node.children.length) {
        const expanded = depth === 0;
        toggle.textContent = expanded ? "▾" : "▸";
        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          const open = li.classList.toggle("collapsed");
          const nowOpen = !open;
          toggle.textContent = nowOpen ? "▾" : "▸";
          toggle.setAttribute("aria-expanded", nowOpen ? "true" : "false");
        });
      }

      const link = document.createElement("a");
      link.className = "toc-link";
      link.href = "#" + encodeURIComponent(node.id);
      link.textContent = node.text;
      link.addEventListener("click", function () {
        closeMenu();
      });

      row.appendChild(toggle);
      row.appendChild(link);
      li.appendChild(row);
      if (node.children.length) li.appendChild(renderToc(node.children, depth + 1));
      ul.appendChild(li);
    });
    return ul;
  }

  function highlightFromHash() {
    const id = decodeURIComponent((location.hash || "").slice(1));
    tocEl.querySelectorAll(".toc-link").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + encodeURIComponent(id));
    });
    if (!id) return;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView();
  }

  async function load() {
    if (!meta) {
      setStatus("找不到这份文档。");
      return;
    }
    titleEl.textContent = meta.title;
    document.title = meta.title;
    setStatus("正在读取 Markdown…");

    let text;
    try {
      const res = await fetch(meta.path);
      if (!res.ok) throw new Error(String(res.status));
      text = await res.text();
    } catch (err) {
      setStatus(
        "读不到 Markdown。请在 app 文件夹里起一个本地服务后再打开，例如：npx serve 。不要直接双击 HTML（file:// 会被浏览器拦住）。"
      );
      return;
    }

    if (typeof marked === "undefined") {
      setStatus("Markdown 渲染库没有加载成功，请检查网络。");
      return;
    }

    marked.setOptions({ gfm: true, breaks: false });
    articleEl.innerHTML = marked.parse(text);

    const used = new Set();
    const heads = [];
    articleEl.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function (el) {
      const level = Number(el.tagName.slice(1));
      const textContent = el.textContent.trim();
      const id = slugify(textContent, used);
      el.id = id;
      if (level === 1) return;
      heads.push({ level: level, text: textContent, id: id });
    });

    const tree = buildTree(heads);
    tocEl.innerHTML = "";
    tocEl.appendChild(renderToc(tree, 0));

    setStatus("");
    highlightFromHash();
  }

  window.addEventListener("hashchange", highlightFromHash);
  load();
})();

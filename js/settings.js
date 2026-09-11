(function () {
  var input = document.getElementById("api-key");
  var statusEl = document.getElementById("key-status");
  var outEl = document.getElementById("test-out");

  function paintStatus() {
    if (window.C1_OR.hasKey()) {
      statusEl.textContent = "本机已保存 key（不会显示完整内容）。";
    } else {
      statusEl.textContent = "还没有保存 key。";
    }
  }

  function showOut(text) {
    outEl.hidden = false;
    outEl.textContent = text;
  }

  document.getElementById("save-key").addEventListener("click", function () {
    var value = input.value.trim();
    if (!value && window.C1_OR.hasKey()) {
      statusEl.textContent = "输入框是空的，原来的 key 没改。";
      return;
    }
    if (!value) {
      statusEl.textContent = "请先粘贴 API key。";
      return;
    }
    window.C1_OR.setKey(value);
    input.value = "";
    paintStatus();
  });

  document.getElementById("clear-key").addEventListener("click", function () {
    window.C1_OR.clearKey();
    input.value = "";
    paintStatus();
    outEl.hidden = true;
  });

  document.getElementById("test-key").addEventListener("click", function () {
    showOut("正在调用 openai/gpt-5.6-luna…");
    window.C1_OR.chat([
      { role: "user", content: "Reply with exactly the word OK." },
    ])
      .then(function (result) {
        showOut(result.text);
      })
      .catch(function (err) {
        showOut(err.message || String(err));
      });
  });

  paintStatus();
})();

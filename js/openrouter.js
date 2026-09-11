window.C1_OR = (function () {
  var STORAGE_KEY = "c1.local.openrouter.apiKey";
  var MODEL = "openai/gpt-5.6-luna";
  var ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

  function getKey() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (err) {
      return "";
    }
  }

  function setKey(value) {
    var key = String(value || "").trim();
    if (!key) {
      clearKey();
      return;
    }
    localStorage.setItem(STORAGE_KEY, key);
  }

  function clearKey() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function hasKey() {
    return getKey().length > 0;
  }

  async function chat(messages) {
    var key = getKey();
    if (!key) {
      throw new Error("还没有保存 OpenRouter API key。请先到设置里填写。");
    }
    var res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
        "HTTP-Referer": location.origin,
        "X-Title": "C1 Deutsch",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
      }),
    });
    var data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error("OpenRouter 返回了无法解析的内容。");
    }
    if (!res.ok) {
      var msg =
        (data && data.error && (data.error.message || data.error)) ||
        "请求失败（" + res.status + "）";
      throw new Error(String(msg));
    }
    var text =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;
    if (!text) {
      throw new Error("模型没有返回文本。");
    }
    return { text: text, raw: data };
  }

  return {
    MODEL: MODEL,
    getKey: getKey,
    setKey: setKey,
    clearKey: clearKey,
    hasKey: hasKey,
    chat: chat,
  };
})();

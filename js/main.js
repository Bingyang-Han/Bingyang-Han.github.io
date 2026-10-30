/* ==========================================================================
   main.js — 韩冰洋 / Han Bingyang personal homepage
   1. Loads section fragments (sections/*.html) into their [data-include]
      shells. Requires HTTP serving (GitHub Pages or a local server such as
      `python3 -m http.server`); plain file:// is blocked by browsers.
   2. Theme toggle (dark / light), persisted in localStorage. The initial
      theme is applied by a small inline script in index.html <head>.
   3. Language toggle (Chinese / Japanese). Chinese is the default and the
      choice is NOT persisted: the page always opens in Chinese.
   4. Top navigation: highlights the section currently in view.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- 1. Section fragments --------------------------------------------- */
  document.querySelectorAll("[data-include]").forEach(function (shell) {
    var src = shell.getAttribute("data-include");
    fetch(src)
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (html) {
        shell.innerHTML = html;
        onScroll();
      })
      .catch(function () {
        shell.innerHTML =
          '<p class="load-error"><span class="zh">该部分加载失败。请通过本地 HTTP 服务器预览，例如 <code>python3 -m http.server</code>。</span><span class="ja">このセクションを読み込めませんでした。ローカルHTTPサーバーでプレビューしてください（例：<code>python3 -m http.server</code>）。</span></p>';
      });
  });

  /* ---- 2. Theme toggle --------------------------------------------------- */
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var root = document.documentElement;
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", "dark");
      }
      localStorage.setItem("theme", isDark ? "light" : "dark");
    });
  }

  /* ---- 3. Language toggle (Chinese default; not persisted) --------------- */
  var langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var root = document.documentElement;
      if (root.getAttribute("data-lang") === "ja") {
        root.removeAttribute("data-lang");
        root.setAttribute("lang", "zh");
        document.title = "韩冰洋 · Han Bingyang";
      } else {
        root.setAttribute("data-lang", "ja");
        root.setAttribute("lang", "ja");
        document.title = "韓冰洋 · Han Bingyang";
      }
    });
  }

  /* ---- 4. Nav highlight: mark the link of the section in view ------------ */
  var navSections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]"),
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]'),
  );

  function onScroll() {
    if (!navSections.length) return;
    var pos = window.scrollY + 110; // just below the fixed nav
    var current = navSections[0];
    for (var i = 0; i < navSections.length; i++) {
      if (navSections[i].offsetTop <= pos) {
        current = navSections[i];
      }
    }
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  onScroll();
})();

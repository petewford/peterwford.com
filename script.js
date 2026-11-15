(function () {
  var root = document.documentElement;

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.dataset.theme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Respect reduced motion: stop autoplaying videos and give people controls
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("video[autoplay]").forEach(function (v) {
      v.removeAttribute("autoplay");
      v.pause();
      v.controls = true;
    });
  }

  var copy = document.getElementById("copy-email");
  if (copy) {
    copy.addEventListener("click", function () {
      var email = copy.dataset.email;
      var done = function (label) {
        copy.textContent = label;
        setTimeout(function () { copy.textContent = "Copy email"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { done("Copied"); },
          function () { done(email); }
        );
      } else {
        done(email);
      }
    });
  }
})();

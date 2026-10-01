/* Caliber Tech Solutions — site interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Contact details from js/config.js ---------- */
  var cfg = window.SITE_CONFIG || {};
  function setAll(sel, fn) { document.querySelectorAll(sel).forEach(fn); }
  if (cfg.email) {
    setAll('[data-bind="email"]', function (a) { a.href = "mailto:" + cfg.email; });
    setAll('[data-text="email"]', function (el) { el.textContent = cfg.email; });
  }
  if (cfg.phoneLink) setAll('[data-bind="phone"]', function (a) { a.href = "tel:" + cfg.phoneLink.replace(/[^\d+]/g, ""); });
  if (cfg.phoneDisplay) setAll('[data-text="phone"]', function (el) { el.textContent = cfg.phoneDisplay; });
  var waDigits = String(cfg.whatsapp || "").replace(/\D/g, "");
  if (waDigits) {
    var waUrl = "https://wa.me/" + waDigits + (cfg.whatsappMessage ? "?text=" + encodeURIComponent(cfg.whatsappMessage) : "");
    setAll('[data-bind="whatsapp"]', function (a) { a.href = waUrl; });
  } else {
    setAll('[data-bind="whatsapp"]', function (a) { a.hidden = true; });
  }
  // Social icons: shown only when a real URL is configured
  var social = cfg.social || {};
  var anySocial = false;
  setAll("[data-social]", function (li) {
    var url = social[li.getAttribute("data-social")];
    if (url && /^https:\/\//.test(url)) { li.querySelector("a").href = url; li.hidden = false; anySocial = true; }
  });
  var socialList = document.querySelector(".topbar-social");
  if (socialList && !anySocial) socialList.hidden = true;

  /* ---------- Hero load sequence ---------- */
  var hero = document.querySelector(".hero");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { hero && hero.classList.add("loaded"); });
  });

  /* ---------- Stat counters (run once, after their reveal) ---------- */
  function formatNum(n) { return n.toLocaleString("en-US"); }
  function countUp(el, delay) {
    var to = parseInt(el.getAttribute("data-to"), 10);
    if (reduceMotion || !to) { el.textContent = formatNum(to); return; }
    var dur = 1200;
    el.textContent = "0";
    setTimeout(function () {
      var start = null;
      function tick(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatNum(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
  }
  document.querySelectorAll(".count").forEach(function (el, i) { countUp(el, 1100 + i * 120); });

  /* ---------- Header state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 960 && nav.classList.contains("open")) setMenu(false); });

  /* ---------- Active nav link ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav ul a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---------- Scroll reveal (once) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  function settle(el) {
    // Remove reveal classes afterwards so hover transitions behave normally
    setTimeout(function () { el.classList.remove("reveal", "in"); el.style.transitionDelay = ""; }, 900);
  }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.remove("reveal"); });
  } else {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); }) : [];
        var idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 80, 320) + "ms";
        el.classList.add("in");
        settle(el);
        revObs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- Project tabs (keyboard accessible) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next); next.focus(); }
    });
  });

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quote-form");
  if (form) {
    var status = form.querySelector(".form-status");
    function setError(input, msg) {
      var field = input.closest(".field");
      var err = field.querySelector(".err");
      if (msg) {
        field.classList.add("invalid");
        input.setAttribute("aria-invalid", "true");
        if (!err) { err = document.createElement("span"); err.className = "err"; err.id = input.id + "-err"; field.appendChild(err); }
        input.setAttribute("aria-describedby", err.id);
        err.textContent = msg;
      } else {
        field.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
        if (err) err.remove();
      }
    }
    function validate() {
      var ok = true;
      var name = form.elements.name, email = form.elements.email;
      if (!name.value.trim()) { setError(name, "Enter your name."); ok = false; } else setError(name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Enter a valid email address, like name@company.com."); ok = false; } else setError(email);
      return ok;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) { status.textContent = ""; form.querySelector('[aria-invalid="true"]').focus(); return; }
      /*
        Connect to your backend here, e.g.
        fetch("/api/quote", { method: "POST", body: new FormData(form) })
      */
      status.textContent = "Quote request sent. Our team will reply within one business day.";
      form.reset();
    });
    form.addEventListener("input", function (e) {
      if (e.target.closest(".field.invalid")) validate();
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

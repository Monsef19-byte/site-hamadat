// =========================================================
// HAMADAT — interactions (carrousels, langue, nav, reveal)
// =========================================================

(function () {
  "use strict";

  /* ---------------- Language toggle (FR/AR + RTL) ---------------- */
  function setLang(lang) {
    document.documentElement.classList.toggle("lang-ar", lang === "ar");
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    try { localStorage.setItem("hamadat_lang", lang); } catch (e) {}
  }

  /* ---------------- Dark mode toggle ---------------- */
  function setTheme(theme) {
    document.documentElement.classList.toggle("dark-mode", theme === "dark");
    try { localStorage.setItem("hamadat_theme", theme); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    var saved = "fr";
    try { saved = localStorage.getItem("hamadat_lang") || "fr"; } catch (e) {}
    setLang(saved);

    var savedTheme = "light";
    try { savedTheme = localStorage.getItem("hamadat_theme") || "light"; } catch (e) {}
    setTheme(savedTheme);
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.classList.contains("dark-mode") ? "dark" : "light";
        setTheme(current === "dark" ? "light" : "dark");
      });
    });

    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.dataset.lang); });
    });

    var burger = document.querySelector(".nav__burger");
    var links = document.querySelector(".nav__links");
    if (burger && links) {
      burger.addEventListener("click", function () {
        links.classList.toggle("nav__links--open");
      });
    }

    /* ---------------- Tabs (en cours / livrées) ---------------- */
    document.querySelectorAll("[data-tabs]").forEach(function (group) {
      var buttons = group.querySelectorAll(".tab-btn");
      var target = document.querySelector(group.dataset.tabs);
      if (!target) return;
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var filter = btn.dataset.filter;
          target.querySelectorAll("[data-category]").forEach(function (card) {
            card.style.display = (filter === "all" || card.dataset.category === filter) ? "" : "none";
          });
        });
      });
    });

    /* ---------------- Reveal on scroll ---------------- */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    /* ---------------- Nav blur on scroll ---------------- */
    var nav = document.querySelector(".nav");
    if (nav) {
      window.addEventListener("scroll", function () {
        nav.style.boxShadow = window.scrollY > 30 ? "0 10px 30px rgba(20,30,30,.14)" : "";
      });
    }

    initHeroCarousel();
    initResHeroCarousel();
    initGalleries();
    initVideoCarousel();
    initVideoLightbox();
  });

  /* ---------------- Full-screen home hero carousel ---------------- */
  function initHeroCarousel() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) return;
    var slides = root.querySelectorAll(".hero__slide");
    var dots = root.querySelectorAll(".hero__dot");
    var idx = 0, timer;
    function show(i) {
      slides.forEach(function (s, si) { s.classList.toggle("active", si === i); });
      dots.forEach(function (d, di) { d.classList.toggle("active", di === i); });
      idx = i;
    }
    function next() { show((idx + 1) % slides.length); }
    function prev() { show((idx - 1 + slides.length) % slides.length); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); restart(); }); });
    var nextBtn = root.querySelector("[data-hero-next]");
    var prevBtn = root.querySelector("[data-hero-prev]");
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
    show(0);
    restart();
  }

  /* ---------------- Residence detail page hero (diaporama with synced caption) ---------------- */
  function initResHeroCarousel() {
    var root = document.querySelector("[data-res-hero]");
    if (!root) return;
    var slides = root.querySelectorAll(".res-hero__slide");
    var dots = root.querySelectorAll(".res-hero__dots .hero__dot");
    var bar = root.querySelector(".res-hero__progress-bar");
    var idx = 0, timer;
    function show(i) {
      slides.forEach(function (s, si) { s.classList.toggle("active", si === i); });
      dots.forEach(function (d, di) { d.classList.toggle("active", di === i); });
      idx = i;
      if (bar) {
        bar.style.transition = "none";
        bar.style.width = "0%";
        void bar.offsetWidth;
        bar.style.transition = "width 5.5s linear";
        bar.style.width = "100%";
      }
    }
    function next() { show((idx + 1) % slides.length); }
    function restart() { clearInterval(timer); timer = setInterval(next, 5500); }
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); restart(); }); });
    if (slides.length) { show(0); restart(); }
  }

  /* ---------------- Residence own diaporama gallery (manual + auto) ---------------- */
  function initGalleries() {
    document.querySelectorAll("[data-gallery]").forEach(function (root) {
      var slides = root.querySelectorAll(".gallery__slide");
      var counter = root.querySelector(".gallery__counter");
      var idx = 0, timer;
      function show(i) {
        slides.forEach(function (s, si) { s.classList.toggle("active", si === i); });
        idx = i;
        if (counter) counter.textContent = (i + 1) + " / " + slides.length;
      }
      function next() { show((idx + 1) % slides.length); }
      function prev() { show((idx - 1 + slides.length) % slides.length); }
      function restart() { clearInterval(timer); timer = setInterval(next, 4500); }
      var nextBtn = root.querySelector("[data-g-next]");
      var prevBtn = root.querySelector("[data-g-prev]");
      if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
      if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
      if (slides.length) { show(0); restart(); }
    });
  }

  /* ---------------- Vidéos YouTube (carrousel horizontal) ---------------- */
  function initVideoCarousel() {
    var track = document.querySelector("[data-video-track]");
    if (!track) return;
    function scrollByCard(sign) {
      var isRtl = document.documentElement.getAttribute("dir") === "rtl";
      var card = track.querySelector(".video-card");
      var step = card ? card.getBoundingClientRect().width + 24 : 320;
      track.scrollBy({ left: (isRtl ? -sign : sign) * step, behavior: "smooth" });
    }
    var prevBtn = document.querySelector("[data-video-prev]");
    var nextBtn = document.querySelector("[data-video-next]");
    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCard(1); });
  }

  /* ---------------- Vidéos YouTube (lightbox) ---------------- */
  function initVideoLightbox() {
    var box = document.querySelector("[data-video-lightbox]");
    if (!box) return;
    var embedWrap = box.querySelector("[data-video-lightbox-embed]");
    function open(id) {
      embedWrap.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="YouTube video player"></iframe>';
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
    }
    function close() {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      embedWrap.innerHTML = "";
    }
    document.querySelectorAll(".video-card").forEach(function (card) {
      var id = card.dataset.youtubeId;
      if (!id) return;
      card.addEventListener("click", function () { open(id); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(id); }
      });
    });
    box.querySelectorAll("[data-video-lightbox-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) close();
    });
  }

  /* ---------------- Contact form (no backend yet) ---------------- */
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.matches("[data-contact-form]")) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      if (btn) {
        var original = btn.textContent;
        btn.textContent = document.documentElement.lang === "ar" ? "تم الإرسال ✓" : "Envoyé ✓";
        setTimeout(function () { btn.textContent = original; form.reset(); }, 2200);
      }
    }
  });
})();

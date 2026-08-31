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

  /* ---------------- Contact form + Opportunités proposal form ----------------
     Both post to the same /api/submit-lead endpoint; the field set differs
     (unit_type/residence vs type_bien/type_demande/localisation) but
     lib/leads.js classify() tells them apart server-side, so the same
     generic handler covers both. */
  var LEAD_FIELD_NAMES = [
    "full_name", "email", "phone", "message",
    "unit_type", "residence",
    "type_bien", "type_demande", "localisation",
  ];

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.matches("[data-contact-form], [data-proposal-form]")) return;
    e.preventDefault();

    var isAr = document.documentElement.lang === "ar";
    var btn = form.querySelector("button[type=submit]");
    var msgEl = form.querySelector("[data-form-msg]");
    var original = btn ? btn.textContent : "";

    function showMsg(text, ok) {
      if (!msgEl) return;
      msgEl.textContent = text;
      msgEl.classList.add("is-visible");
      msgEl.classList.toggle("is-ok", ok);
      msgEl.classList.toggle("is-error", !ok);
    }

    var data = new FormData(form);
    var payload = { website: data.get("website") || "", source: form.dataset.leadSource || "contact", lang: isAr ? "ar" : "fr" };
    LEAD_FIELD_NAMES.forEach(function (name) { payload[name] = data.get(name) || ""; });

    if (btn) { btn.disabled = true; btn.textContent = isAr ? "إرسال..." : "Envoi..."; }

    fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok) throw new Error(json.error || "Erreur serveur.");
          return json;
        });
      })
      .then(function () {
        showMsg(isAr ? "تم استلام طلبكم، سنتصل بكم قريبًا." : "Votre demande a bien été reçue, nous vous recontacterons rapidement.", true);
        form.reset();
      })
      .catch(function () {
        showMsg(isAr ? "تعذر إرسال الطلب. حاولوا مجددًا أو اتصلوا بنا مباشرة." : "Impossible d'envoyer la demande. Réessayez ou contactez-nous directement.", false);
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
  });

  /* ---------------- Opportunités : cartes "Ce que nous recherchons" ----------------
     Click → présélectionne le type dans le formulaire de proposition et y
     scrolle, comme les opp-cta de New Era. */
  document.querySelectorAll(".opp-card").forEach(function (card) {
    function activate() {
      var typeBien = card.getAttribute("data-typebien");
      var typeDemande = card.getAttribute("data-typedemande");
      var selBien = document.getElementById("prop-typebien");
      var selDemande = document.getElementById("prop-typedemande");
      if (typeBien && selBien) selBien.value = typeBien;
      if (typeDemande && selDemande) selDemande.value = typeDemande;
      var target = document.getElementById("proposer");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      var nom = document.getElementById("prop-nom");
      if (nom) window.setTimeout(function () { nom.focus({ preventScroll: true }); }, 500);
    }
    card.addEventListener("click", activate);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  });

  /* ---------------- Bulle flottante (Appeler / WhatsApp) ---------------- */
  var floatCta = document.getElementById("floatCta");
  var floatCard = document.getElementById("floatCard");
  if (floatCta && floatCard) {
    floatCta.addEventListener("click", function () { floatCard.classList.toggle("show"); });
    var floatClose = document.getElementById("floatClose");
    if (floatClose) floatClose.addEventListener("click", function () { floatCard.classList.remove("show"); });
    document.addEventListener("click", function (e) {
      if (!floatCard.contains(e.target) && e.target !== floatCta && !floatCta.contains(e.target)) {
        floatCard.classList.remove("show");
      }
    });
  }

  /* ---------------- Modal « Prendre rendez-vous » universel ----------------
     Tout élément marqué [data-rdv-trigger] (nav, héro, cartes résidence,
     pied de page, barre d'actions rapides mobile) ouvre le même modal, sans
     markup dupliqué par page. Désactivable depuis le dashboard (Réglages) —
     dans ce cas ces liens restent des ancres normales vers #contact, pas de
     data-rdv-trigger émis côté serveur donc rien à débrancher ici. */
  (function () {
    var ctaFlags = window.HAMADAT_CTA_FLAGS || {};
    if (ctaFlags.rdvModal === false) return;
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-rdv-trigger]"));
    if (!triggers.length) return;
    var isAr = document.documentElement.lang === "ar";

    var modal = document.createElement("div");
    modal.className = "rdv-modal";
    modal.id = "rdvModal";
    var hasContactForm = !!document.getElementById("contact");
    var homeLink = document.querySelector(".nav__logo");
    var homeHref = homeLink ? homeLink.getAttribute("href") : "index.html";
    var formHref = hasContactForm ? "#contact" : homeHref + "#contact";
    var telLink = document.querySelector(".mini-cta-bar a[href^='tel:']");
    var waLink = document.querySelector(".mini-cta-bar a[href^='https://wa.me']");
    var telHref = telLink ? telLink.getAttribute("href") : "#";

    modal.innerHTML =
      '<div class="rdv-modal-box">' +
        '<button type="button" class="rdv-modal-close" id="rdvModalClose" aria-label="Fermer">✕</button>' +
        '<h3>' + (isAr ? "أخذ موعد" : "Prendre rendez-vous") + '</h3>' +
        '<p>' + (isAr ? "اختاروا الطريقة الأنسب للتواصل مع حمادات." : "Choisissez la façon la plus simple pour vous d’entrer en contact avec Hamadat.") + '</p>' +
        '<div class="rdv-modal-actions">' +
          '<a href="' + telHref + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' + (isAr ? "اتصل بنا" : "Nous appeler") + '</a>' +
          '<a href="mailto:' + (window.HAMADAT_CONTACT_EMAIL || "") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>' + (isAr ? "راسلنا عبر البريد" : "Nous écrire un e-mail") + '</a>' +
          '<a href="' + formHref + '" id="rdvModalForm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' + (isAr ? "تعبئة الاستمارة" : "Remplir le formulaire") + '</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    function openRdv(e) {
      if (e) e.preventDefault();
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeRdv() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
    triggers.forEach(function (el) { el.addEventListener("click", openRdv); });
    document.getElementById("rdvModalClose").addEventListener("click", closeRdv);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeRdv(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeRdv(); });
    if (hasContactForm) {
      document.getElementById("rdvModalForm").addEventListener("click", function (e) {
        e.preventDefault();
        closeRdv();
        var target = document.getElementById("contact");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    }
  })();

  /* ---------------- Partage enrichi (pages résidence) ----------------
     navigator.share() natif quand disponible (partage titre + description +
     lien direct vers l'app choisie), repli WhatsApp avec la même description
     + lien plutôt qu'un simple nom de résidence. */
  document.querySelectorAll(".share-btn[data-share-url]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-share-title") || document.title;
      var text = btn.getAttribute("data-share-text") || title;
      var url = btn.getAttribute("data-share-url") || location.href;
      if (navigator.share) {
        navigator.share({ title: title, text: text, url: url }).catch(function () {});
        return;
      }
      var waText = text + "\n" + url;
      window.open("https://wa.me/?text=" + encodeURIComponent(waText), "_blank", "noopener");
    });
  });
})();

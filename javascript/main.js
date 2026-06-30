/**
 * Performance Analyst — main.js
 * Handles: mobile nav toggle, smooth-scroll active state,
 * header scroll shadow, and psychometric calculator scaffold.
 * All DOM interaction — no dependencies required.
 */

"use strict";

/* ─────────────────────────────────────
   1. MOBILE NAVIGATION TOGGLE
───────────────────────────────────── */
(function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu   = document.getElementById("nav-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  /* Close on nav link click */
  menu.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* Close on outside click */
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  /* Close on Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
      document.body.style.overflow = "";
    }
  });
})();


/* ─────────────────────────────────────
   2. PREMIUM HEADER SCROLL
───────────────────────────────────── */
(function initHeaderScroll() {

    const header = document.getElementById("site-header");
    if (!header) return;

    function updateHeader() {
        if (window.scrollY > 80) {
            header.classList.add("scrolled");
            header.setAttribute("data-scrolled","true");
        } else {
            header.classList.remove("scrolled");
            header.removeAttribute("data-scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {passive:true});
    updateHeader();

})();


/* ─────────────────────────────────────
   3. ACTIVE NAV LINK (scroll spy)
───────────────────────────────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], main[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");

  if (!sections.length || !navLinks.length) return;

  const NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-height") || "72",
    10
  );

  function getActiveSection() {
    let active = null;
    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= NAV_HEIGHT + 24) {
        active = section.id;
      }
    });
    return active;
  }

  function updateActiveLink() {
    const activeId = getActiveSection();
    navLinks.forEach(function (link) {
      const href = link.getAttribute("href").slice(1);
      if (href === activeId) {
        link.setAttribute("aria-current", "page");
        link.classList.add("nav-link--active");
      } else {
        link.removeAttribute("aria-current");
        link.classList.remove("nav-link--active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
})();

/*BUTTON ACTION*/
(function initConsultationForm() {

    const form = document.getElementById("consultation-form");
    const status = document.getElementById("consultation-status");

    if (!form) return;

    form.addEventListener("submit", function(e) {

        e.preventDefault();

        status.textContent =
        "✓ Thank you for contacting Performance Analyst. Our engineering team has received your request and will contact you as soon as possible.";

        status.className =
        "form-status form-status--success";

        form.reset();

    });

})();

/* ─────────────────────────────────────
   5. CONTACT FORM — CLIENT-SIDE HOOK
   Wire to your backend / email service.
───────────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById("contact-form");
  const status = document.getElementById("contact-form-status");
  const submit = document.getElementById("contact-submit-btn");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    submit.textContent = "Sending…";
    submit.disabled    = true;
    if (status) { status.textContent = ""; status.className = "form-status"; }

    /*
     * TODO: Replace with your real form-submission endpoint, e.g. Formspree, EmailJS, or custom API.
     * Example:
     *   const data = new FormData(form);
     *   fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: data, headers:{'Accept':'application/json'} })
     *     .then(res => { if (res.ok) showSuccess(); else showError(); })
     *     .catch(showError);
     */
    setTimeout(function () {
      if (status) {
        status.textContent =
"✓ Thank you for contacting Performance Analyst. Our engineering team has received your enquiry and will contact you as soon as possible.";
        status.className    = "form-status form-status--success";
      }
      form.reset();
      submit.textContent = "Send Message";
      submit.disabled    = false;
    }, 1400);
  });
})();


// =============================
// Scroll Reveal Animation
// =============================

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {

    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(element => {

        const top = element.getBoundingClientRect().top;

        if (top < triggerBottom) {
            element.classList.add("active");
        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// =========================
// Animated Counter
// =========================

const counters = document.querySelectorAll(".counter-number");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = parseInt(counter.dataset.target);

        const suffix = counter.dataset.suffix || "";

        let current = 0;

        const increment = Math.ceil(target / 80);

        function update() {

            current += increment;

            if (current < target) {

                counter.textContent = current + suffix;

                requestAnimationFrame(update);

            } else {

                counter.textContent = target + suffix;

            }

        }

        update();

        observer.unobserve(counter);

    });

});

counters.forEach(counter => observer.observe(counter));



// =============================
// Back To Top Button
// =============================
(function(){
const btn=document.getElementById("backToTop");
if(!btn) return;
window.addEventListener("scroll",()=>{
btn.classList.toggle("show",window.scrollY>400);
},{passive:true});
btn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
})();

// =============================
// Hero Background Slider
// =============================
(function(){
const hero=document.querySelector(".hero-image");
if(!hero) return;
const images=[
"assets/1.jpg",
"assets/power plant.png",
"assets/renewable enegy.png",
"assets/Mission Critical Projects.jpg",
"assets/infra project.png"
];
let i=0;
setInterval(()=>{
hero.style.opacity="0";
setTimeout(()=>{
i=(i+1)%images.length;
hero.src=images[i];
hero.style.opacity="1";
},500);
},5000);
})();

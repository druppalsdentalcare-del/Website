/* Dr. Uppal's Dental Care — interactions & animation (vanilla, no dependencies) */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Header state + reading progress */
  const progress = document.querySelector(".progress");
  const onScroll = () => {
    document.body.classList.toggle("scrolled", scrollY > 40);
    if (progress) {
      const max = doc.scrollHeight - innerHeight;
      progress.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    const iconOpen = menuBtn.innerHTML;
    const iconClose = '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    const toggle = (open) => {
      menu.hidden = !open;
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuBtn.innerHTML = open ? iconClose : iconOpen;
    };
    menuBtn.addEventListener("click", () => toggle(menu.hidden));
    menu.addEventListener("click", (e) => e.target.closest("a") && toggle(false));
    addEventListener("keydown", (e) => e.key === "Escape" && !menu.hidden && toggle(false));
  }

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll("[data-reveal], .steps li");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add("in"));

  /* Animated counters */
  const counters = document.querySelectorAll("[data-count]");
  const fmt = new Intl.NumberFormat("en-IN");
  const runCounter = (el) => {
    const target = +el.dataset.count;
    if (reduce) return (el.textContent = fmt.format(target));
    const t0 = performance.now(), dur = 1800;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt.format(Math.round(target * eased));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const co = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  /* 3D tilt + spotlight on cards */
  if (finePointer && !reduce) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
        card.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
        card.style.setProperty("--gx", `${x * 100}%`);
        card.style.setProperty("--gy", `${y * 100}%`);
      });
      card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });
    const hero = document.querySelector(".hero");
    if (hero) hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
      hero.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
    /* subtle parallax on hero art */
    const heroArt = document.querySelector(".hero-art");
    if (heroArt) addEventListener("pointermove", (e) => {
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      heroArt.style.transform = `translate(${dx * -18}px, ${dy * -18}px)`;
    }, { passive: true });
  }

  /* Before / after slider */
  document.querySelectorAll("[data-compare]").forEach((c) => {
    const input = c.querySelector("input");
    const set = () => c.style.setProperty("--pos", input.value + "%");
    input.addEventListener("input", set); set();
  });

  /* Treatment category filter */
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("active", c === chip));
    const f = chip.dataset.filter;
    document.querySelectorAll("#t-grid .t-card").forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hide", !show);
      if (show) { card.classList.remove("in"); requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("in"))); }
    });
  }));

  /* FAQ search */
  const search = document.getElementById("faq-search");
  if (search) {
    const groups = document.querySelectorAll(".faq-group");
    const none = document.querySelector(".no-results");
    search.addEventListener("input", () => {
      const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let total = 0;
      groups.forEach((g) => {
        const groupName = g.querySelector("h2").textContent.toLowerCase();
        let visible = 0;
        g.querySelectorAll(".faq").forEach((f) => {
          const text = (f.textContent + " " + groupName).toLowerCase();
          const hit = terms.every((t) => text.includes(t));
          f.classList.toggle("hide", !hit);
          if (hit) visible++;
          if (terms.length && hit && visible <= 1) f.open = true;
        });
        g.classList.toggle("hide", !visible);
        g.classList.add("in");
        total += visible;
      });
      if (none) none.hidden = total > 0;
    });
  }

  /* Table-of-contents scrollspy */
  const tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length) {
    const map = new Map([...tocLinks].map((a) => [document.querySelector(a.getAttribute("href")), a]));
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { tocLinks.forEach((a) => a.classList.remove("active")); map.get(e.target)?.classList.add("active"); }
    }), { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((_, sec) => sec && spy.observe(sec));
  }

  /* Booking form → WhatsApp / email */
  const form = document.getElementById("book-form");
  if (form) {
    const status = form.querySelector(".form-status");
    const date = form.querySelector("#f-date");
    const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);
    const pre = new URLSearchParams(location.search).get("treatment");
    if (pre) form.treatment.value = pre;
    let via = "whatsapp";
    form.querySelectorAll("[data-via]").forEach((b) => b.addEventListener("click", () => (via = b.dataset.via)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
      const bad = [...form.querySelectorAll("[required]")].filter((el) => !el.checkValidity());
      if (bad.length) {
        bad.forEach((el) => el.classList.add("invalid"));
        status.textContent = "Please fill in the highlighted fields.";
        status.classList.add("error");
        bad[0].focus();
        return;
      }
      status.classList.remove("error");
      const d = Object.fromEntries(new FormData(form));
      const tSel = form.treatment;
      const treatment = tSel.value ? tSel.options[tSel.selectedIndex].text : "General consultation";
      const when = new Date(d.date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      const lines = [
        `Hello ${form.dataset.clinic}, I'd like to book an appointment.`, "",
        `Name: ${d.name}`, `Phone: ${d.phone}`, d.email ? `Email: ${d.email}` : null,
        `Treatment: ${treatment}`, `Preferred date: ${when}`, `Preferred time: ${d.time}`,
        d.message ? `Notes: ${d.message}` : null,
      ].filter((l) => l !== null).join("\n");
      if (via === "email") {
        location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent("Appointment request — " + d.name)}&body=${encodeURIComponent(lines)}`;
        status.textContent = "Opening your email app… If nothing happens, please call us.";
      } else {
        window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
        status.textContent = "Opening WhatsApp… Just tap send and we'll confirm your slot.";
      }
    });
  }
})();

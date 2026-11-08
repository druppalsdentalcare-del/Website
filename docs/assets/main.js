/* Dr. Uppal's Dental Hub & Implant Center — interactions & animation (vanilla JS) */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Header state, reading progress, "why" meter */
  const progress = document.querySelector(".progress");
  const why = document.querySelector(".why");
  const whyFill = document.querySelector(".why-fill");
  const onScroll = () => {
    document.body.classList.toggle("scrolled", scrollY > 30);
    const max = doc.scrollHeight - innerHeight;
    if (progress) progress.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
    if (why && whyFill) {
      const r = why.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / (r.height * 0.8)));
      whyFill.style.setProperty("--why", k.toFixed(3));
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
  const revealEls = $$("[data-reveal], .steps li");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add("in"));

  /* Pointer effects: tilt, spotlight, hero glow, parallax, magnetic button */
  if (finePointer && !reduce) {
    $$("[data-tilt]").forEach((card) => {
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
    $$(".reason").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - r.left}px`);
      el.style.setProperty("--gy", `${e.clientY - r.top}px`);
    }));
    const hero = document.querySelector(".hero");
    const heroArt = document.querySelector(".hero-art");
    if (hero) hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
      hero.style.setProperty("--my", `${e.clientY - r.top}px`);
      if (heroArt) heroArt.style.transform = `translate(${(e.clientX / innerWidth - 0.5) * -20}px, ${(e.clientY / innerHeight - 0.5) * -20}px)`;
    });
    const mag = document.querySelector("[data-magnetic]");
    if (mag) {
      mag.addEventListener("pointermove", (e) => {
        const r = mag.getBoundingClientRect();
        mag.style.setProperty("--tx", `${(e.clientX - r.left - r.width / 2) * 0.25}px`);
        mag.style.setProperty("--ty", `${(e.clientY - r.top - r.height / 2) * 0.35}px`);
      });
      mag.addEventListener("pointerleave", () => { mag.style.setProperty("--tx", "0px"); mag.style.setProperty("--ty", "0px"); });
    }
  }

  /* Live "Open now" badge (clinic time = India Standard Time) */
  $$(".open-badge[data-hours]").forEach((b) => {
    try {
      const hours = JSON.parse(b.dataset.hours);
      const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).map((p) => [p.type, p.value]));
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
      const now = +parts.hour * 60 + +parts.minute;
      const toMin = (s) => { const [h, m] = s.split(":"); return +h * 60 + +m; };
      const today = hours.find((h) => h.d.includes(day) && h.o);
      const open = today && now >= toMin(today.o) && now < toMin(today.c);
      b.classList.add(open ? "open" : "closed");
      const fmt = (s) => { let [h, m] = s.split(":").map(Number); const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return `${h}${m ? ":" + String(m).padStart(2, "0") : ""} ${ap}`; };
      b.querySelector(".txt").textContent = open ? `Open now · until ${fmt(today.c)}` : "Closed now · book ahead on WhatsApp";
    } catch (e) { /* keep default label */ }
  });

  /* Gallery lightbox */
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const media = lb.querySelector(".lb-media"), cap = lb.querySelector("figcaption");
    let last = null;
    const open = (tile) => {
      last = tile;
      const img = tile.querySelector("img, .ph");
      media.innerHTML = "";
      media.appendChild(img.cloneNode(true));
      cap.textContent = tile.querySelector("figcaption strong")?.textContent || "";
      lb.hidden = false;
      document.body.classList.add("menu-open");
      lb.querySelector(".lb-close").focus();
    };
    const close = () => { lb.hidden = true; document.body.classList.remove("menu-open"); last && last.focus(); };
    $$("[data-lightbox]").forEach((t) => {
      t.addEventListener("click", () => open(t));
      t.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(t)));
    });
    lb.addEventListener("click", (e) => (e.target === lb || e.target.closest(".lb-close")) && close());
    addEventListener("keydown", (e) => e.key === "Escape" && !lb.hidden && close());
  }

  /* Treatment category filter */
  const chips = $$(".chip[data-filter]");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.toggle("active", c === chip));
    const f = chip.dataset.filter;
    $$("#t-grid .t-card").forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hide", !show);
      if (show) { card.classList.remove("in"); requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("in"))); }
    });
  }));

  /* FAQ search */
  const search = document.getElementById("faq-search");
  if (search) {
    const groups = $$(".faq-group");
    const none = document.querySelector(".no-results");
    search.addEventListener("input", () => {
      const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      let total = 0;
      groups.forEach((g) => {
        const groupName = g.querySelector("h2").textContent.toLowerCase();
        let visible = 0;
        $$(".faq", g).forEach((f) => {
          const hit = terms.every((t) => (f.textContent + " " + groupName).toLowerCase().includes(t));
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
  const tocLinks = $$(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map(tocLinks.map((a) => [document.querySelector(a.getAttribute("href")), a]));
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { tocLinks.forEach((a) => a.classList.remove("active")); map.get(e.target)?.classList.add("active"); }
    }), { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((_, sec) => sec && spy.observe(sec));
  }

  /* Booking forms → WhatsApp / email (full form and the quick form) */
  $$("form.book-form").forEach((form) => {
    const status = form.querySelector(".form-status");
    const date = form.querySelector("input[type=date]");
    if (date) { const t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset()); date.min = t.toISOString().slice(0, 10); }
    const pre = new URLSearchParams(location.search).get("treatment");
    if (pre && form.treatment) form.treatment.value = pre;
    let via = "whatsapp";
    $$("[data-via]", form).forEach((b) => b.addEventListener("click", () => (via = b.dataset.via)));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      $$(".invalid", form).forEach((el) => el.classList.remove("invalid"));
      const bad = $$("[required]", form).filter((el) => !el.checkValidity());
      if (bad.length) {
        bad.forEach((el) => el.classList.add("invalid"));
        status.textContent = "Please fill in the highlighted fields.";
        status.classList.add("error");
        bad[0].focus();
        return;
      }
      status.classList.remove("error");
      const d = Object.fromEntries(new FormData(form));
      const sel = form.treatment;
      const treatment = sel && sel.value ? sel.options[sel.selectedIndex].text : "General consultation";
      const when = d.date ? new Date(d.date + "T00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : null;
      const lines = [
        `Hello ${form.dataset.clinic}, I'd like to book a consultation.`, "",
        `Name: ${d.name}`, `Phone: ${d.phone}`, d.email ? `Email: ${d.email}` : null,
        `Treatment: ${treatment}`, when ? `Preferred date: ${when}` : null, d.time ? `Preferred time: ${d.time}` : null,
        d.message ? `Notes: ${d.message}` : null,
      ].filter(Boolean).join("\n");
      if (via === "email") {
        location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent("Consultation request — " + d.name)}&body=${encodeURIComponent(lines)}`;
        status.textContent = "Opening your email app… If nothing happens, please call us.";
      } else {
        window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
        status.textContent = "Opening WhatsApp… just tap send and we’ll confirm your time.";
      }
    });
  });
})();

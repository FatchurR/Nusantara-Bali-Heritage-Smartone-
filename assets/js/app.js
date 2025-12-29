(() => {
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Reveal ----------
  const revealEls = $$(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObserver.observe(el));

  // ---------- Audio ----------
  const audio = $("#bgAudio");
  const audioBtn = $("#audioBtn");
  const audioLabel = $("#audioLabel");

  let audioOn = (localStorage.getItem("audioOn") === "1");

  async function fadeAudio(toOn){
    if (!audio) return;
    const targetVol = toOn ? 0.22 : 0.0;
    const step = 0.02;
    const interval = 80;

    if (toOn) {
      audio.volume = 0.0;
      try { await audio.play(); } catch (_) {}
    }

    const timer = setInterval(() => {
      if (toOn) {
        audio.volume = Math.min(targetVol, audio.volume + step);
        if (audio.volume >= targetVol - 0.001) clearInterval(timer);
      } else {
        audio.volume = Math.max(0.0, audio.volume - step);
        if (audio.volume <= 0.001) {
          clearInterval(timer);
          audio.pause();
        }
      }
    }, interval);
  }

  function renderAudioLabel(){
    if (!audioLabel) return;
    audioLabel.textContent = audioOn ? "Audio On" : "Audio Off";
  }

  if (audioBtn) {
    audioBtn.addEventListener("click", async () => {
      audioOn = !audioOn;
      localStorage.setItem("audioOn", audioOn ? "1" : "0");
      renderAudioLabel();
      await fadeAudio(audioOn);
    });
  }
  renderAudioLabel();
  if (audioOn) fadeAudio(true);

  // ---------- Progress dots (optional) ----------
  const dots = $$(".progress-dot");
  if (dots.length) {
    const sections = $$("section[id]");
    const dotObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        dots.forEach(d => d.classList.toggle("is-active", d.getAttribute("data-dot") === id));
        localStorage.setItem("lastSection", "#"+id);
      });
    }, { threshold: 0.35 });
    sections.forEach(s => dotObserver.observe(s));
  }

  // ---------- Return to last section (optional) ----------
  const returnBtn = $("#returnToLast");
  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      const last = localStorage.getItem("lastSection") || "#overview";
      const el = $(last);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else location.href = "index.html" + last;
    });
  }

  // ---------- Year ----------
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();

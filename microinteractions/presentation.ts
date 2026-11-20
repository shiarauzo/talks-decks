const slides = [...document.querySelectorAll<HTMLElement>(".slide")];
const notesPanel = document.querySelector<HTMLElement>("#notesPanel");
const notesContent = document.querySelector<HTMLElement>("#notesContent");
const notesSlide = document.querySelector<HTMLElement>("#notesSlide");
const closeNotes = document.querySelector<HTMLButtonElement>("#closeNotes");
const progress = document.querySelector<HTMLElement>("#progressBar");

if (slides.length === 0) {
  throw new Error("The presentation has no slides.");
}

const clampIndex = (index: number): number =>
  Math.max(0, Math.min(slides.length - 1, index));

const indexFromHash = (): number => {
  const parsed = Number(window.location.hash.slice(1));
  return Number.isInteger(parsed) && parsed > 0 ? clampIndex(parsed - 1) : 0;
};

let current = indexFromHash();

const updateNotes = (): void => {
  const aside = slides[current]?.querySelector("aside");
  if (notesContent) notesContent.innerHTML = aside?.innerHTML ?? "";
  if (notesSlide) notesSlide.textContent = String(current + 1).padStart(2, "0");
};

const restartLoop = (element: HTMLElement): void => {
  element.style.animation = "none";
  void element.offsetWidth;
  element.style.removeProperty("animation");
};

const QUIZ_ALT_PAUSE_MS = 800;
let quizAltTimer: number | null = null;
let quizAltShowB = false;

const stopQuizAlt = (): void => {
  if (quizAltTimer !== null) {
    window.clearTimeout(quizAltTimer);
    quizAltTimer = null;
  }
  quizAltShowB = false;
};

const parseCssTimeMs = (value: string): number => {
  const trimmed = value.trim().split(",")[0]?.trim() ?? "";
  const amount = Number.parseFloat(trimmed);
  if (!Number.isFinite(amount)) return 0;
  return trimmed.endsWith("ms") ? amount : amount * 1000;
};

const quizMotionDurationMs = (ex: HTMLElement): number => {
  const motion = ex.querySelector<HTMLElement>(".quiz-pop");
  if (!motion) return 2400;
  const styles = getComputedStyle(motion);
  return Math.max(
    parseCssTimeMs(styles.animationDuration) +
      parseCssTimeMs(styles.animationDelay),
    2400,
  );
};

const applyQuizAlt = (split: HTMLElement, showB: boolean): HTMLElement | null => {
  const items = [...split.querySelectorAll<HTMLElement>(":scope > .quiz-ex")];
  if (items.length < 2) return null;

  items.forEach((item, index) => {
    item.classList.toggle("is-active", showB ? index === 1 : index === 0);
  });

  const active = items[showB ? 1 : 0] ?? null;
  if (active) {
    active.querySelectorAll<HTMLElement>(".quiz-pop").forEach(restartLoop);
  }
  return active;
};

const startQuizAlt = (slide: HTMLElement): void => {
  stopQuizAlt();
  const split = slide.querySelector<HTMLElement>(".quiz-split.quiz-alt");
  if (!split) return;

  const tick = (): void => {
    const active = applyQuizAlt(split, quizAltShowB);
    const holdMs =
      (active ? quizMotionDurationMs(active) : 2400) + QUIZ_ALT_PAUSE_MS;

    quizAltTimer = window.setTimeout(() => {
      quizAltShowB = !quizAltShowB;
      tick();
    }, holdMs);
  };

  tick();
};

const restartDemos = (slide: HTMLElement | undefined): void => {
  stopQuizAlt();
  if (!slide) return;

  slide.querySelectorAll<HTMLElement>(".stagger-list").forEach((list) => {
    list.classList.remove("run");
    void list.offsetWidth;
    list.classList.add("run");
  });

  if (slide.querySelector(".quiz-split.quiz-alt")) {
    startQuizAlt(slide);
    return;
  }

  // Keep side-by-side quiz loops in sync when entering the slide.
  slide
    .querySelectorAll<HTMLElement>(
      ".quiz-menu, .quiz-toast, .quiz-pop, .quiz-rows span",
    )
    .forEach(restartLoop);
};

const showSlide = (index: number, updateHash = true): void => {
  current = clampIndex(index);

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === current;
    slide.classList.toggle("active", active);
    slide.ariaHidden = String(!active);
  });

  if (progress) {
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  }

  if (updateHash) history.replaceState(null, "", `#${current + 1}`);
  document.title = `${String(current + 1).padStart(2, "0")} — Microinteracciones`;
  updateNotes();
  restartDemos(slides[current]);
};

const toggleNotes = (): void => {
  const open = notesPanel?.classList.toggle("open") ?? false;
  notesPanel?.setAttribute("aria-hidden", String(!open));
};

const toggleFullscreen = (): void => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen();
};

document.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.closest("input, textarea, [contenteditable=true]")) return;

  if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(event.key)) {
    event.preventDefault();
    showSlide(current + 1);
  }

  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    showSlide(current - 1);
  }

  if (event.key === "Home") showSlide(0);
  if (event.key === "End") showSlide(slides.length - 1);
  if (event.key.toLowerCase() === "n") toggleNotes();
  if (event.key.toLowerCase() === "f") toggleFullscreen();
});

document.addEventListener("click", (event) => {
  const target = event.target as Element;
  if (
    target.closest(
      "button, a, .notes-panel, .demo-stage, .dropdown-wrap, .popover-demo, .quiz-ex",
    )
  ) {
    return;
  }
  showSlide(current + 1);
});

closeNotes?.addEventListener("click", toggleNotes);

document.querySelectorAll<HTMLButtonElement>("[data-toggle-dropdown]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const wrap = button.closest(".dropdown-wrap");
    const menu = wrap?.querySelector<HTMLElement>(".dropdown");
    if (!menu) return;
    const willOpen = !menu.classList.contains("open");
    document.querySelectorAll(".dropdown.open").forEach((el) => el.classList.remove("open"));
    menu.classList.toggle("open", willOpen);
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-toggle-popover]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const wrap = button.closest(".popover-demo");
    const pop = wrap?.querySelector<HTMLElement>(".popover");
    if (!pop) return;
    const willOpen = !pop.classList.contains("open");
    document.querySelectorAll(".popover.open").forEach((el) => el.classList.remove("open"));
    pop.classList.toggle("open", willOpen);
  });
});

document.querySelectorAll<HTMLButtonElement>("[data-replay-stagger]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const list = button
      .closest(".panel")
      ?.querySelector<HTMLElement>(".stagger-list");
    if (!list) return;
    list.classList.remove("run");
    void list.offsetWidth;
    list.classList.add("run");
  });
});

document.querySelectorAll<HTMLButtonElement>(".vocab-card[data-vocab]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    card.classList.remove("is-playing");
    void card.offsetWidth;
    card.classList.add("is-playing");
  });
});

window.addEventListener("hashchange", () => showSlide(indexFromHash(), false));

showSlide(current, false);

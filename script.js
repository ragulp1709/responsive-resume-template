document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = [...document.querySelectorAll(".primary-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeNavigation = () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    nav.classList.toggle("is-open", !isOpen);
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: reducedMotion ? 0 : 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleSection) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${visibleSection.target.id}`
          );
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.2, 0.5] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});

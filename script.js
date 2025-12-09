document.addEventListener("DOMContentLoaded", () => {
  // Set the current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Simple collapse toggles for sections tagged with data-section
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-toggle");
      const target = document.querySelector(`[data-section="${key}"]`);
      if (!target) return;
      const isHidden = target.getAttribute("hidden") !== null;
      if (isHidden) {
        target.removeAttribute("hidden");
        btn.textContent = "Collapse";
      } else {
        target.setAttribute("hidden", "hidden");
        btn.textContent = "Expand";
      }
    });
  });

  // Tag filtering for publications
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const publications = Array.from(document.querySelectorAll(".pub-item"));

  if (filterButtons.length && publications.length) {
    const applyFilter = (tag) => {
      publications.forEach((pub) => {
        const tags = (pub.getAttribute("data-tags") || "").split(",").map((t) => t.trim().toLowerCase());
        const shouldShow = tag === "all" || tags.includes(tag);
        pub.style.display = shouldShow ? "grid" : "none";
      });
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.getAttribute("data-filter");
        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyFilter(tag);
      });
    });
  }
});

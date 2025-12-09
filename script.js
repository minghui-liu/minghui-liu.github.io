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
      const section = btn.closest("section");
      const targets = section ? section.querySelectorAll(`[data-section="${key}"], .filter-bar`) : [];
      
      if (targets.length === 0) return;
      
      const firstTarget = Array.from(targets)[0];
      const isHidden = firstTarget.getAttribute("hidden") !== null || firstTarget.style.display === "none";
      
      targets.forEach(target => {
        if (isHidden) {
          target.removeAttribute("hidden");
          target.style.display = "";
        } else {
          target.setAttribute("hidden", "hidden");
          target.style.display = "none";
        }
      });
      
      btn.textContent = isHidden ? "Collapse" : "Expand";
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

  // Prevent disabled links from navigating
  document.querySelectorAll('a.disabled').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
});

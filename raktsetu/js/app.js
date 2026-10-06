/* Shared UI behavior across all pages */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        links.classList.toggle("is-open");
      });
      links.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", () => links.classList.remove("is-open"))
      );
    }

    // Highlight current page in nav
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[href]").forEach(a => {
      if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page");
    });

    // Footer year
    document.querySelectorAll("[data-year]").forEach(el => {
      el.textContent = new Date().getFullYear();
    });

    // Reflect logged-in session in header, if a slot exists
    const session = RS.getSession();
    const slot = document.querySelector("[data-session-slot]");
    if (slot) {
      if (session) {
        slot.innerHTML =
          '<span class="pill">' + session.role + ': ' + session.name + '</span> ' +
          '<a href="#" class="btn btn-outline btn-sm" data-logout>Log out</a>';
        const logoutBtn = slot.querySelector("[data-logout]");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            RS.clearSession();
            location.href = "login.html";
          });
        }
      }
    }
  });
})();

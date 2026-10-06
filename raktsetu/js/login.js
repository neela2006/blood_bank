document.addEventListener("DOMContentLoaded", function () {
  let role = "Donor";
  const roleLabel = document.getElementById("roleLabel");
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("formMsg");

  document.querySelectorAll(".role-tab").forEach(tab => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".role-tab").forEach(t => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      role = tab.dataset.role;
      roleLabel.textContent = role;
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = document.getElementById("name").value.trim();
    RS.setSession({ name, role, loggedInAt: Date.now() });

    msg.className = "form-msg is-success";
    msg.textContent = `Welcome, ${name}! Redirecting to your ${role.toLowerCase()} area…`;

    setTimeout(function () {
      if (role === "Admin") location.href = "dashboard.html";
      else if (role === "Patient") location.href = "emergency.html";
      else location.href = "find-donors.html";
    }, 900);
  });
});

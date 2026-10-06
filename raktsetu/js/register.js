document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const msg = document.getElementById("formMsg");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const donor = {
      name: data.get("fullName").trim(),
      phone: data.get("phone").trim(),
      age: Number(data.get("age")),
      gender: data.get("gender"),
      bloodGroup: data.get("bloodGroup"),
      city: data.get("city"),
      email: data.get("email") || "",
      lastDonated: data.get("lastDonated") || "",
      available: data.get("available") === "on",
    };

    try {
      await RS.addDonor(donor);
    } catch (err) {
      msg.className = "form-msg is-error";
      msg.textContent = "Registration failed: " + err.message;
      return;
    }

    msg.className = "form-msg is-success";
    msg.textContent = `Thank you, ${donor.name.split(" ")[0]}! You're now registered as a ${donor.bloodGroup} donor in ${donor.city}. We'll reach out only for genuine emergency requests near you.`;
    form.reset();
    document.getElementById("available").checked = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const payload = {
      name: document.getElementById("name").value.trim(),
      email: (document.getElementById("email") || {}).value || "",
      subject: (document.getElementById("subject") || {}).value || "",
      message: (document.getElementById("message") || {}).value || "",
    };
    try {
      await RS.sendContact(payload);
    } catch (err) {
      msg.className = "form-msg is-error";
      msg.textContent = "Could not send message: " + err.message;
      return;
    }
    const name = payload.name.split(" ")[0];
    msg.className = "form-msg is-success";
    msg.textContent = `Thanks, ${name}! Your message has been recorded. It has been saved in the database.`;
    form.reset();
  });
});

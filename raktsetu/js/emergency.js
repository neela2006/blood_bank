document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("emergencyForm");
  const msg = document.getElementById("formMsg");
  const matchList = document.getElementById("matchList");
  const matchCount = document.getElementById("matchCount");
  const matchHint = document.getElementById("matchHint");
  const bloodGroupSel = document.getElementById("bloodGroup");
  const citySel = document.getElementById("city");

  // Urgency picker visual state
  document.querySelectorAll(".urgency-opt").forEach(opt => {
    opt.addEventListener("click", function () {
      document.querySelectorAll(".urgency-opt").forEach(o => o.classList.remove("is-active"));
      opt.classList.add("is-active");
    });
  });

  function initials(name) {
    return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  }

  async function updateMatches() {
    const bg = bloodGroupSel.value;
    const city = citySel.value;
    if (!bg) {
      matchCount.textContent = "—";
      matchHint.style.display = "block";
      matchList.innerHTML = "";
      return;
    }
    let matches = [];
    try { matches = await RS.compatibleDonorsFor(bg, city); } catch (err) { console.error(err); }
    matchHint.style.display = "none";
    matchCount.textContent = matches.length + " match" + (matches.length === 1 ? "" : "es");
    matchList.innerHTML = matches.slice(0, 5).map(d => `
      <div class="donor-card" style="padding:12px 14px;">
        <div class="donor-avatar" style="width:38px;height:38px;font-size:0.8rem;">${initials(d.name)}</div>
        <div class="donor-main">
          <h4 style="font-size:0.92rem;">${d.name}</h4>
          <span style="font-size:0.78rem;">${d.city}</span>
        </div>
        <span class="blood-chip" style="font-size:0.78rem;">${d.bloodGroup}</span>
      </div>
    `).join("") || `<div class="empty-state" style="padding:24px;">No compatible donors online for ${bg} in ${city || "any city"} right now.</div>`;
  }

  bloodGroupSel.addEventListener("change", updateMatches);
  citySel.addEventListener("change", updateMatches);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const bg = data.get("bloodGroup");
    const city = data.get("city");
    let matches = [], request;
    try {
      matches = await RS.compatibleDonorsFor(bg, city);
      request = await RS.addRequest({
      patient: data.get("patient"),
      hospital: data.get("hospital"),
      bloodGroup: bg,
      units: Number(data.get("units")),
      city,
      urgency: data.get("urgency"),
      contact: data.get("contact"),
        notes: data.get("notes") || "",
      });
    } catch (err) {
      msg.className = "form-msg is-error";
      msg.textContent = "Could not send request: " + err.message;
      return;
    }

    msg.className = "form-msg is-success";
    msg.textContent = `Alert sent. ${matches.length} compatible donor${matches.length === 1 ? "" : "s"} in ${city} ${matches.length === 1 ? "has" : "have"} been notified for ${request.units} unit(s) of ${bg}. Reference ID: ${request.id}.`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

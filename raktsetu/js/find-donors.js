document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("searchForm");
  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("resultCount");
  const onlyAvailable = document.getElementById("onlyAvailable");

  function initials(name) {
    return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  }

  async function render() {
    const bloodGroup = document.getElementById("bg").value;
    const city = document.getElementById("city").value;
    let results = [];
    try {
      results = (await RS.findDonors({
        bloodGroup: bloodGroup || undefined,
        city: city || undefined,
        onlyAvailable: onlyAvailable.checked,
      })).sort((a, b) => (b.available - a.available));
    } catch (err) {
      countEl.textContent = "Error";
      resultsEl.innerHTML = `<div class="empty-state">Could not load donors: ${err.message}</div>`;
      return;
    }

    countEl.textContent = results.length + " donor" + (results.length === 1 ? "" : "s") + " found";

    if (!results.length) {
      resultsEl.innerHTML = `<div class="empty-state">No donors match those filters yet. Try widening your search, or invite someone to <a href="register.html" style="color:var(--crimson); font-weight:600;">register as a donor</a>.</div>`;
      return;
    }

    resultsEl.innerHTML = results.map(d => `
      <div class="donor-card">
        <div class="donor-avatar">${initials(d.name)}</div>
        <div class="donor-main">
          <h4>${d.name}</h4>
          <span>${d.city} · Age ${d.age} · Last donated ${d.lastDonated || "N/A"}</span>
        </div>
        <div class="donor-tags">
          <span class="blood-chip">${d.bloodGroup}</span>
          <span class="status-chip ${d.available ? 'available' : 'unavailable'}">${d.available ? 'Available' : 'Unavailable'}</span>
        </div>
      </div>
    `).join("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    render();
  });
  onlyAvailable.addEventListener("change", render);

  render();
});

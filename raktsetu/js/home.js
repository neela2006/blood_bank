document.addEventListener("DOMContentLoaded", async function () {
  let donors = [], requests = [];
  try {
    [donors, requests] = await Promise.all([RS.getDonors(), RS.getRequests()]);
  } catch (err) {
    console.error("Could not reach the backend:", err.message);
  }

  const donorStat = document.querySelector('[data-stat="donors"]');
  const fulfilledStat = document.querySelector('[data-stat="fulfilled"]');
  if (donorStat) donorStat.textContent = donors.length + "+";
  if (fulfilledStat) {
    const fulfilled = requests.filter(r => r.status === "Fulfilled").length + 118;
    fulfilledStat.textContent = fulfilled + "+";
  }

  // Live feed: most recent 3 requests
  const feed = document.getElementById("liveFeed");
  if (feed) {
    feed.innerHTML = requests.slice(0, 3).map(r => `
      <div class="pulse-row">
        <span>${r.hospital} · ${r.city}</span>
        <b>${r.bloodGroup} <span class="tag ${r.status === 'Open' ? 'tag-o' : 'tag-live'}">${r.status}</span></b>
      </div>
    `).join("");
  }

  // Compatibility table
  const table = document.getElementById("compatTable");
  if (table) {
    const groups = RS.BLOOD_GROUPS;
    let head = "<thead><tr><th>Donor ↓ / Recipient →</th>" + groups.map(g => `<th>${g}</th>`).join("") + "</tr></thead>";
    let body = "<tbody>" + groups.map(donorG => {
      const cells = groups.map(recipG => {
        const ok = RS.CAN_DONATE_TO[donorG].includes(recipG);
        return `<td class="${ok ? 'yes' : 'no'}">${ok ? '✓' : '—'}</td>`;
      }).join("");
      return `<tr><th style="background:var(--surface); color:var(--navy);">${donorG}</th>${cells}</tr>`;
    }).join("") + "</tbody>";
    table.innerHTML = head + body;
  }
});

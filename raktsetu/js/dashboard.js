document.addEventListener("DOMContentLoaded", async function () {
  let donors = [], requests = [], stock = {};
  try {
    [donors, requests, stock] = await Promise.all([RS.getDonors(), RS.getRequests(), RS.getStock()]);
  } catch (err) {
    alert("Could not reach the backend. Is the server running?\n" + err.message);
  }

  document.getElementById("statDonors").textContent = donors.length;
  document.getElementById("statDonorsSub").textContent = "Across " + RS.CITIES.length + " cities";
  document.getElementById("statAvailable").textContent = donors.filter(d => d.available).length;
  document.getElementById("statOpen").textContent = requests.filter(r => r.status === "Open").length;
  document.getElementById("statUnits").textContent = Object.values(stock).reduce((a, b) => a + b, 0);

  // Stock bars
  const maxStock = Math.max(...Object.values(stock), 1);
  const stockBars = document.getElementById("stockBars");
  stockBars.innerHTML = RS.BLOOD_GROUPS.map(g => {
    const units = stock[g] || 0;
    const pct = Math.round((units / maxStock) * 100);
    const level = units < 10 ? "low" : units < 25 ? "mid" : "ok";
    return `
      <div class="stock-row">
        <span><strong>${g}</strong></span>
        <div class="stock-track"><div class="stock-fill ${level}" style="width:${pct}%"></div></div>
        <span>${units} u</span>
      </div>
    `;
  }).join("");

  // Requests table
  document.getElementById("requestCount").textContent = requests.length + " total";
  document.getElementById("requestsBody").innerHTML = requests.slice(0, 12).map(r => `
    <tr>
      <td>${r.patient}</td>
      <td>${r.hospital}</td>
      <td><span class="blood-chip" style="font-size:0.78rem;">${r.bloodGroup}</span></td>
      <td>${r.units}</td>
      <td>${r.city}</td>
      <td>${r.urgency}</td>
      <td><span class="status-chip ${r.status === 'Open' ? 'unavailable' : 'available'}">${r.status}</span></td>
      <td>${RS.timeAgo(r.createdAt)}</td>
    </tr>
  `).join("") || `<tr><td colspan="8">No requests yet.</td></tr>`;

  // Donors table
  document.getElementById("donorCount").textContent = donors.length + " total";
  document.getElementById("donorsBody").innerHTML = donors.slice(0, 14).map(d => `
    <tr>
      <td>${d.name}</td>
      <td><span class="blood-chip" style="font-size:0.78rem;">${d.bloodGroup}</span></td>
      <td>${d.city}</td>
      <td>${d.age}</td>
      <td><span class="status-chip ${d.available ? 'available' : 'unavailable'}">${d.available ? 'Available' : 'Unavailable'}</span></td>
      <td>${RS.timeAgo(d.registeredAt)}</td>
    </tr>
  `).join("") || `<tr><td colspan="6">No donors yet.</td></tr>`;
});

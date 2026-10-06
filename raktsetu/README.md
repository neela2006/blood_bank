# RaktSetu — Blood Bank & Emergency Donor Finder

A MERN-stack-styled platform that connects blood donors with patients and hospitals in real time. Built as a final-year Computer Science and Engineering project.

**Student:** A Shenbaga Neela (Register No. 950023104023)
**Department:** Computer Science and Engineering
**Institution:** Anna University Regional Campus — Tirunelveli

## About this build

This repository is a complete, professional front end for the project — every screen described in the project proposal (donor registration, donor search, emergency requests, admin dashboard, login) is fully built and interactive using plain **HTML, CSS and JavaScript**, with a `localStorage`-backed mock database standing in for the MongoDB + Express + Node.js API layer described in the proposal.

That means:
- It runs anywhere with no build step, server, or database — just open `index.html`, or host the folder on GitHub Pages / Netlify / Vercel.
- Every form (donor registration, emergency request, contact, login) actually works: submissions are saved to the browser's `localStorage` and immediately reflected in **Find Donors** and the **Admin Dashboard**.
- The dashboard, donor search, and blood-compatibility matching all read from the same shared data layer (`js/data.js`), which seeds 24 realistic demo donors and 3 demo requests on first load.
- To connect a real MongoDB + Express + Node.js backend, replace the functions in `js/data.js` with `fetch()` calls to your API — the rest of the site (forms, rendering, validation) needs no changes.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Landing page, live stats, how it works, blood-compatibility chart |
| Find Donors | `find-donors.html` | Search the donor directory by blood group and city |
| Become a Donor | `register.html` | Donor registration form |
| Emergency Request | `emergency.html` | Post an emergency blood request with live donor matching |
| Dashboard | `dashboard.html` | Admin view of donors, requests, and blood stock |
| Log In | `login.html` | Role-based demo login (Donor / Patient / Admin) |
| About | `about.html` | Motivation, objectives, scope, tech stack, references, team |
| Contact | `contact.html` | Contact form |

## Project structure

```
raktsetu/
├── index.html
├── about.html
├── register.html
├── find-donors.html
├── emergency.html
├── dashboard.html
├── login.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── data.js        # mock data layer / API stand-in
│   ├── app.js          # shared nav + session UI
│   ├── home.js
│   ├── register.js
│   ├── find-donors.js
│   ├── emergency.js
│   ├── dashboard.js
│   ├── login.js
│   └── contact.js
├── assets/
│   └── favicon.svg
└── README.md
```

## Running locally

No installation needed:

1. Download / clone this repository.
2. Open `index.html` in any modern browser.

Or serve it locally for a cleaner experience:

```bash
npx serve .
# or
python3 -m http.server 5500
```

## Deploying

Push this folder to a GitHub repository, then enable **GitHub Pages** (Settings → Pages → Deploy from branch → `main` / root) — the site will be live at `https://<username>.github.io/<repo>/` with no extra configuration.

## Tech stack referenced in the proposal

HTML5 · CSS3 · JavaScript · React.js · Node.js · Express.js · MongoDB · GitHub

## Notes

- Data is stored only in the visiting browser's `localStorage`; clearing site data resets the demo dataset.
- This is an academic project. It is **not** a substitute for contacting a hospital or ambulance service in a real emergency.

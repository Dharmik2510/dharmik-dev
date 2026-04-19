# Dharmik Soni — Portfolio (React + Vite)

## 🚀 Setup in Cursor / VS Code

### Step 1 — Open the project
```
File → Open Folder → select `dharmik-portfolio`
```

### Step 2 — Install dependencies
Open the terminal (`` Ctrl+` ``) and run:
```bash
npm install
```

### Step 3 — Start dev server
```bash
npm run dev
```
Opens at **http://localhost:3000** 🎉

---

## 📁 File Structure

```
dharmik-portfolio/
├── index.html                  # Entry HTML
├── vite.config.js              # Vite config
├── package.json                # Dependencies
└── src/
    ├── main.jsx                # React root
    ├── App.jsx                 # Main app — assembles all sections
    ├── styles/
    │   └── globals.css         # Design tokens + global styles
    ├── data/
    │   └── index.js            # ← ALL YOUR REAL DATA HERE
    ├── hooks/
    │   └── index.js            # useCursor, useClock, useScrollFade, useThreeCosmos
    └── components/
        ├── Navbar.jsx          # Fixed navigation
        ├── Navbar.module.css
        ├── Hero.jsx            # Boarding pass hero section
        ├── Hero.module.css
        └── Sections.jsx        # Journey, About, Experience, Projects, Articles, Contact, Footer
```

---

## ✏️ How to Customize

### Update your data → `src/data/index.js`
Everything is in one place:
- `PERSONAL` — name, email, phone, links
- `EXPERIENCE` — job history with bullets
- `PROJECTS` — your real GitHub projects
- `ARTICLES` — Medium article titles + links
- `SKILLS` — tech stack chips
- `CERTIFICATIONS` — your certs

### Change colors → `src/styles/globals.css`
Edit the `:root` CSS variables at the top.

### Add a new section
1. Add your data to `src/data/index.js`
2. Create a new component in `src/components/Sections.jsx`
3. Import and add it to `src/App.jsx`

---

## 📦 Build for Production

```bash
npm run build
```
Output goes to `dist/` — deploy to Vercel, Netlify, or GitHub Pages.

### Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify (free)
```bash
npm run build
# drag the dist/ folder to netlify.com/drop
```

---

## 🛠 Tech Stack

| Package | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool + dev server |
| Three.js | Particle cosmos background |
| Framer Motion | Entrance animations |
| react-intersection-observer | Scroll fade-in |

---

## 📞 Contact
- **Phone:** +1 902-989-2923
- **Email:** dhsoni2510@gmail.com
- **LinkedIn:** linkedin.com/in/dharmik-soni-a385131a0
- **GitHub:** github.com/Dharmik2510
- **Medium:** medium.com/@dhsoni2510

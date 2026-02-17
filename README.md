# API Academy — Python · Flask · MySQL

An interactive learning app that teaches complete beginners how to build REST APIs with Python, Flask, and MySQL. 19 progressive lessons from environment setup to a deployed, production-grade API.

## Features

- **19 lessons** across 5 modules (Setup → Foundation → Database → Production → Capstone)
- **Syntax highlighting** for Python, SQL, and Bash code blocks
- **Interactive quizzes** with retry functionality
- **Hands-on challenges** with checkbox progress tracking
- **Persistent progress** — saved to localStorage, survives page refreshes
- **Keyboard navigation** — Arrow keys or N/P to navigate lessons
- **Fully responsive** — works on desktop, tablet, and mobile
- **Zero dependencies** beyond React + Vite (no heavy UI libraries)

## Deploy to Vercel

### Option 1: One-click (recommended)
1. Push this project to a GitHub/GitLab repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Vite — click **Deploy**
5. Done. Your app is live.

### Option 2: Vercel CLI
```bash
npm i -g vercel
cd api-academy
vercel
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
api-academy/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CodeBlock.jsx / .module.css    # Syntax-highlighted code
│   │   ├── Quiz.jsx / .module.css         # Interactive quiz w/ retry
│   │   └── Challenge.jsx / .module.css    # Hands-on checklist
│   ├── data/
│   │   └── lessons.js                     # All 10 lessons content
│   ├── hooks/
│   │   └── useProgress.js                 # localStorage persistence
│   ├── highlight.js                       # Python/SQL/Bash tokenizer
│   ├── App.jsx / .module.css              # Main app shell
│   ├── index.css                          # Global styles + variables
│   └── main.jsx                           # Entry point
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                            # Vercel deployment config
└── README.md
```

## Curriculum

| # | Module | Lesson | Key Topics |
|---|--------|--------|------------|
| 1 | Setup | Dev Environment | Python, MySQL, VS Code, venv, pip |
| 2 | Foundation | What is an API? | REST, HTTP methods, JSON, status codes |
| 3 | Foundation | How HTTP Works | Headers, parameters (URL/query/body), status codes |
| 4 | Foundation | Python Basics | Variables, dicts, functions, try/except |
| 5 | Foundation | Debugging | Tracebacks, common errors, logging |
| 6 | Foundation | Flask Framework | Routes, endpoints, CRUD, request/response |
| 7 | Foundation | Testing with Postman | Postman walkthrough, cURL syntax, collections |
| 8 | Database | MySQL Basics | Tables, data types, CRUD SQL |
| 9 | Database | Flask + MySQL | Connection, cursors, parameterised queries |
| 10 | Database | SQL Injection | Attack demo, parameterised fix, security |
| 11 | Database | Relationships & JOINs | Foreign keys, one-to-many, many-to-many, JOINs |
| 12 | Database | Pagination & Filtering | LIMIT/OFFSET, query params, sort whitelisting |
| 13 | Production | Error Handling | Validation, response envelopes, global handlers |
| 14 | Production | Password Hashing & CORS | bcrypt, salt, CORS configuration |
| 15 | Production | Authentication | API keys, JWT, role-based access |
| 16 | Production | Project Structure | Config, blueprints, .env, .gitignore |
| 17 | Production | Automated Testing | pytest, fixtures, assertions, test client |
| 18 | Production | Deployment | Gunicorn, Procfile, Railway, health checks |
| 19 | Capstone | Invoice API | Full project combining all lessons |

## License

MIT

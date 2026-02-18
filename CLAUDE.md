Final and Complete CLAUDE.md
CLAUDE.md
This file provides guidance to Claude Code when working with code in this repository.
Project Overview
This repository is for the development of a new, single-page marketing website for the business "Agent Flow".
The website's primary goal is to serve as a strategic lead-generation tool, attracting and converting a specific client profile: "The Established Expert" (business leaders, founders, CEOs). The overall tone should be professional, confident, and clear, akin to a premium business consultancy but reflecting a modern aesthetic and design that demonstrates our tech heritage and shows we are modern and cutting edge.
The core of the site will be a long-scrolling homepage that tells a specific narrative through defined sections, with all copy provided by the project owner.
Design & Content Guidance
Visual Style: The aesthetic should be clean, modern, and professional. Prioritize clarity, readability, and ample white space.
Color Palette: Adhere strictly to the defined color palette and its intended usage. These should be defined as CSS variables.
Typography: Use a highly readable sans-serif font like Inter for body copy and a strong, confident font for headlines.
Imagery: Use abstract graphics or icons representing transformation and clarity. Avoid generic stock photos.
Content Source: All primary copy will be provided. Do not generate placeholder business copy.
Technical Architecture & Development Setup
Technology Stack: This is a static website using HTML5, CSS3, and JavaScript (ES6).
No frameworks (React, Vue, etc.) or UI component libraries (Bootstrap, Tailwind) are to be used. Build all components from scratch.
No self-hosted backend is required. All dynamic functionality will be handled via third-party services.
Form Handling & Dynamic Content:
Primary CTA ("Book a Discovery Call"): Implement using a Calendly pop-up widget.
Other Forms (e.g., Contact Form): Use a standard HTML <form> that posts to a Formspree endpoint.
Project Structure:
code
Code
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── images/
Coding Standards & Best Practices
General Style:
Comments: Use comments to explain the why, not the what.
Naming Conventions: Use camelCase for JavaScript and kebab-case for CSS classes and filenames.
Accessibility (A11y): A top priority. Use semantic HTML, provide descriptive alt attributes for all images, and ensure all interactive elements are keyboard-accessible and have appropriate ARIA roles.
Styling (CSS) Conventions:
Methodology: Use the BEM (Block, Element, Modifier) naming convention for all CSS classes (e.g., .card, .card__title, .card--featured).
CSS Variables: Define the entire color palette as CSS variables in the :root at the top of style.css.
code
CSS
:root {
  --gradient-blue: #a6c3e8;
  --gradient-purple: #c6b8e4;
  --deep-navy: #2c3e50;
  --warm-cream: #fdfaf6;
  --soft-coral: #f7a89d; /* Accent CTA */
  --sage-green: #a1bba2;
  --dark-grey: #3c3c3c; /* Primary Text */
  --medium-grey: #6b6b6b; /* Secondary Text */
}
Units: Use rem for font-size and layout spacing (margin, padding). Use px for border-width.
Responsiveness: Use a mobile-first approach. Define base styles first, then use min-width media queries to add complexity for larger screens.
Founders Page Articles:
When adding new articles/posts to founders.html, ALWAYS:
1. Use semantic `<article>` tags with the class `post-card post-card__native`
2. Add a unique anchor ID (e.g., `id="article-slug"`) so the article can be directly linked
3. Use kebab-case for IDs based on the article title (e.g., "Move 37 Moment" → `id="move-37-moment"`)
4. Include a "View on LinkedIn →" link if the post originated from LinkedIn
5. After adding, provide the direct link to the user: `goagentflow.com/founders.html#article-slug`

AI Discoverability (llms.txt & Markdown):
The site serves structured markdown versions of pages for AI agents. When page content changes:
1. Update the corresponding `.html.md` file (e.g., `index.html` → `index.html.md`)
2. If adding a new HTML page, create a matching `.html.md` file and add it to `llms.txt`
3. When adding new articles to `founders.html`, also add a summary entry to `founders.html.md`
4. The `.dockerignore` allows `llms.txt` and `*.html.md` files through — do not re-exclude them

JavaScript & User Interaction:
Syntax: Use modern JavaScript (ES6+). Prefer const over let.
User Feedback & Error Handling:
Form Submissions: On submit, disable the button to prevent multiple clicks and show a loading state.
Success State: On success, hide the form and show a clear success message.
Error State: On failure, re-enable the form button and show a simple error message (e.g., "Something went wrong, please try again.").

## goagentflow.com — What Lives Where

Everything deployed to **goagentflow.com** is built from three repos. If you're looking to work on a specific feature, here's where to go:

| Feature | Repo / Folder | Local Path |
|---------|--------------|------------|
| **Marketing website** (homepage, Our Approach, Our Story, Founders, privacy, etc.) | `goagentflow/AFv2` (this repo) | `~/Desktop/AFv2-temp` |
| **Copilot Check-up** (the quiz at `/assess/`) | `winehusband/agentflow-insight-pulse` | `~/Desktop/agentflow-insight-pulse` |
| **Admin dashboard** (client data, reports at `/assess/admin`) | `winehusband/agentflow-insight-pulse` | `~/Desktop/agentflow-insight-pulse` |
| **Revenue & deal pipeline** (`/assess/admin` → Revenue tab) | `winehusband/agentflow-insight-pulse` | `~/Desktop/agentflow-insight-pulse` |
| **CRM** (prospects, orgs, contacts — Supabase database) | `winehusband/agentflow-insight-pulse` | `~/Desktop/agentflow-insight-pulse` |
| **Auth** (login, signup, password reset at `/assess/auth`) | `winehusband/agentflow-insight-pulse` | `~/Desktop/agentflow-insight-pulse` |
| **Opportunity Finder** (discovery tool at `/discovery/`) | `goagentflow/remix-of-af_disdcovery_agent` | `~/Desktop/AF_DiscoveryProcess_Agent/AF_DiscoveryP_agent` |
| **CI/CD pipeline** (Cloud Build, Dockerfile, nginx) | `goagentflow/AFv2` (this repo) | `~/Desktop/AFv2-temp` |

### Deployment
All three repos auto-deploy via Google Cloud Build. Push to any repo → full site rebuilds and deploys to goagentflow.com in ~3-5 minutes. The pipeline config lives in this repo (`cloudbuild.yaml`, `Dockerfile`, `nginx.conf`).

### Key files for CRM/database work
Before reading or writing to the Supabase CRM, always read `/Users/hamishnicklin/Desktop/agentflow-insight-pulse/CRM_ACCESS.md` first. Env vars are in that repo's `.env` file.

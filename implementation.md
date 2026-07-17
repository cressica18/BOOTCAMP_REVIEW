Build a complete "Bootcamp Review" full-stack web application with the following exact specifications. This is a Docker-focused learning project, so the application logic should be clean and simple, well-structured, maintainable, and appropriate for a college bootcamp assignment while following good software engineering practices.
TECH STACK
- Frontend: React using Vite
- Backend: Node.js + Express
- Data storage: a JSON file on disk (no database), read/written via Node's fs module, with data persistence handled properly so it survives container restarts

CORE FEATURES
1. View all reviews (list view, newest first)
2. Add a review
3. Delete a review
4. Filter reviews by week number

Each review object must contain:
- id (unique, e.g. uuid or timestamp-based)
- weekNumber (integer, required)
- reviewerName (string, optional — show "Anonymous" if not provided)
- rating (integer 1–5, required, validate range)
- reviewText (string, required)
- createdAt (timestamp, auto-generated)

BACKEND REQUIREMENTS
- Express REST API with routes:
  - GET /api/reviews → all reviews
  - GET /api/reviews?week=X → filtered by week
  - POST /api/reviews → add a review (validate all fields server-side, return proper error messages/status codes)
  - DELETE /api/reviews/:id → delete a review
- Store reviews in a reviews.json file inside a /data directory (structure the code so this path is easy to mount as a Docker volume)
- Use proper error handling middleware, input validation, and sensible HTTP status codes
- Enable CORS for the frontend to communicate with it
- Include a .env-friendly PORT config (default 5000) using dotenv, with a .env.example file
- Add a simple health check route: GET /api/health

FRONTEND REQUIREMENTS
- React (Vite) single-page app that consumes the backend API (use an environment variable like VITE_API_URL for the backend base URL, with a .env.example)
- Pages/sections: Review list, Add Review form, Week filter control
- Fully responsive, clean component structure (separate components for ReviewCard, ReviewForm, ReviewList, WeekFilter, etc.)
- Handle loading states, empty states, and error states gracefully
- Confirm before deleting a review (modal or inline confirmation, not a browser alert)
- Show star ratings visually (not just numbers)

UI/UX DESIGN REQUIREMENTS — VERY IMPORTANT
Do NOT use a generic AI-generated look (no default Bootstrap/Material feel, no purple gradient hero sections, no cookie-cutter card grids with drop shadows everywhere). I want a genuinely unique, creative, opinionated visual identity. Specifically:
- Pick one distinctive design direction (e.g. bold neo-brutalist with thick borders and hard shadows, or an editorial/zine-style layout with asymmetric grids and bold typography, or a warm hand-crafted "notebook/journal" aesthetic, or a retro-terminal aesthetic) and commit to it fully and consistently
- Use a deliberate, non-default color palette (not the typical blue/purple SaaS gradient) with clear primary/accent/neutral tokens
- Use expressive typography — pick distinctive Google Fonts (not default system fonts) and use scale/weight contrast intentionally
- Add small delightful micro-interactions (hover states, transitions, subtle animations on add/delete) using CSS transitions — keep it lightweight, no heavy animation libraries required
- Custom-styled star ratings, buttons, form inputs, and filter control — nothing should look like an unstyled default HTML element
- Design the empty state and error state with as much care as the main content state
- All styling should be plain CSS or CSS modules (no Tailwind/Bootstrap) so the creative direction isn't diluted by a utility framework's defaults

DOCKER REQUIREMENTS — THE MAIN FOCUS
- Create two SEPARATE Dockerfiles: one in the frontend directory, one in the backend directory
- No Docker Compose — each container must be buildable and runnable independently via plain `docker build` and `docker run` commands
- Backend Dockerfile:
  - Use an official Node LTS image, multi-stage if it adds value, otherwise a clean single-stage build
  - Install dependencies efficiently (leverage layer caching by copying package.json first)
  - Expose the correct port
  - Set up the /data directory so it can be used with a Docker volume or bind mount for persistence
  - Use a non-root user if practical
  - Include a .dockerignore
- Frontend Dockerfile:
  - Multi-stage build: build the Vite app in a Node build stage, then serve the static output with a lightweight server (e.g. nginx or `serve`)
  - Include a .dockerignore
  - Make sure the VITE_API_URL can be configured at build time (explain in code comments how build-time env vars work with Vite)
- Structure the repo as a monorepo with clear top-level /frontend and /backend folders, each fully self-contained with its own package.json, Dockerfile, .dockerignore, and .env.example
The backend data directory must be designed so I can easily demonstrate:
- running without a volume (data loss after container removal),
- running with a bind mount,
- running with a named Docker volume.

These demonstrations should be reflected in the README commands.


PROJECT STRUCTURE
Generate a clear folder tree first, then generate all files with full code (no placeholders or "add your code here" comments — everything must be complete and runnable).

README.md REQUIREMENTS
Generate a thorough README.md at the project root containing:
1. Project description
2. Local setup instructions (running frontend and backend without Docker, for dev)
3. Docker build commands (exact commands for both frontend and backend images, with proper tags)
4. Docker run commands (exact commands for both containers, including port mapping and the volume/bind mount setup used for data persistence)
5. A "Notes" section documenting what was tried for persistence (named volumes vs bind mounts vs writing inside the container) and a clear explanation of why the chosen approach works and what the tradeoffs of the alternatives are — written as genuine engineering notes, not marketing copy

OUTPUT FORMAT

Before generating any code, output the complete folder structure and wait for my confirmation.

Then generate the project incrementally in the following phases:

Phase 1:
- Backend
- Backend package.json
- Express server
- API
- JSON persistence
- Validation
- Error handling

Stop and wait for me to type "continue".

Phase 2:
- Frontend
- Components
- CSS
- API integration

Stop and wait for me to type "continue".

Phase 3:
- Dockerfiles
- .dockerignore
- .env.example
- README

Stop and wait for me to type "continue".

Never regenerate files that have already been generated unless I explicitly ask for modifications.

Every file must be complete and immediately runnable.


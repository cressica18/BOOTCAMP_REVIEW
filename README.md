# Bootcamp Review

A full-stack web application for managing bootcamp reviews with a unique cyberpunk neo-brutalist interface. Built with React + Vite (frontend) and Node.js + Express (backend), featuring JSON file persistence for data storage.

## Project Description

This application allows users to:
- View all bootcamp reviews (newest first)
- Add new reviews with week number, rating, and review text
- Delete existing reviews
- Filter reviews by week number
- See star ratings visually

## Local Development Setup

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend server will start on `http://localhost:5000`

If port `5000` is already in use on your machine, start the backend on a different port:

```bash
# run backend on port 5001
PORT=5001 npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will start on `http://localhost:5173`

If your backend is running on a non-default port, set `VITE_API_URL` when starting the frontend (or copy `frontend/.env.example` to `frontend/.env` and adjust):

```bash
# run frontend and point to backend on port 5001
VITE_API_URL=http://localhost:5001 npm run dev
```

## Docker Setup

### Build Backend Image

```bash
cd backend
docker build -t bootcamp-review-api .
```

### Build Frontend Image

```bash
cd frontend
# Embed the backend URL at build time. On macOS Docker, use host.docker.internal
docker build -t bootcamp-review-frontend --build-arg VITE_API_URL=http://host.docker.internal:5002 .
```

Linux note: on Linux Docker the special host `host.docker.internal` may not be available. Use a user-defined Docker network and the backend container name as the API host instead:

```bash
# create a network (one-time)
docker network create bootcamp-net

# run backend on the network (example with bind mount and published host port 5002)
cd ..
docker run -d --name bootcamp-backend --network bootcamp-net -p 5002:5000 \
  -v "$(pwd)/backend/data:/app/data" \
  -e CORS_ORIGIN=http://localhost:8080 \
  bootcamp-review-api

# build frontend pointing at the backend container hostname
cd frontend
docker build -t bootcamp-review-frontend --build-arg VITE_API_URL=http://bootcamp-backend:5000 .

# run frontend on the same network and publish to host port 8080
docker run -d --name bootcamp-frontend --network bootcamp-net -p 8080:80 bootcamp-review-frontend
```

### Run Backend Container

```bash
# Without persistence (data lost when container is removed)
docker run -d -p 5000:5000 --name bootcamp-backend bootcamp-review-api

# With bind mount (data persists on host filesystem)
docker run -d -p 5000:5000 --name bootcamp-backend \
  -v $(pwd)/data:/app/data \
  bootcamp-review-api

# With named volume (data persists in Docker volume)
docker run -d -p 5000:5000 --name bootcamp-backend \
  -v bootcamp-data:/app/data \
  bootcamp-review-api
```

### Run Frontend Container

```bash
# With API URL set at build time
docker run -d -p 80:80 --name bootcamp-frontend \
  -e VITE_API_URL=http://localhost:5000 \
  bootcamp-review-frontend

# Or with the default (localhost:5000)
docker run -d -p 80:80 --name bootcamp-frontend \
  bootcamp-review-frontend
```

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/reviews` | List all reviews (newest first) |
| GET | `/api/reviews?week=X` | Filter reviews by week number |
| GET | `/api/reviews/weeks` | Get unique week numbers |
| GET | `/api/reviews/:id` | Get single review |
| POST | `/api/reviews` | Create new review |
| DELETE | `/api/reviews/:id` | Delete review |

## Docker Persistence Notes

### Why This Approach Works

The backend stores reviews in `/app/data/reviews.json` inside the container. During the Docker build, this directory is created but remains empty. For data persistence across container restarts, you must mount a volume.

### Approaches Compared

**No Volume (default)**
- Data is written inside the container's filesystem
- When the container is removed (`docker rm`), all data is lost
- Useful for testing, not for production

**Bind Mount**
- `-v $(pwd)/data:/app/data` maps a host directory to the container
- Data persists on the host filesystem
- Easy to inspect: just look at the `data/reviews.json` file
- Host directory permissions must allow container writes

**Named Volume**
- `-v bootcamp-data:/app/data` creates a managed Docker volume
- Data persists until you explicitly remove the volume (`docker volume rm bootcamp-data`)
- More portable across systems
- Cannot directly inspect files without `docker exec`

### Recommended for Development

Use a bind mount during development for easy data inspection:
```bash
docker run -d -p 5000:5000 -v $(pwd)/data:/app/data bootcamp-review-api
```
## Docker Experiment Notes

During development I tested several Docker features to understand how they affect the application.

### Bind Mounts
- I used a bind mount to map the backend `data` directory from the host machine into the container.
- This allowed changes made inside the container to immediately appear on the host.
- It worked well for development because I could inspect `reviews.json` directly.

### Named Volumes
- I also tested Docker named volumes for storing review data.
- The review data remained available even after stopping and recreating containers.
- This is a cleaner approach for persistent application data because Docker manages the storage.

### Environment Variables
- I used `.env.example` files for both frontend and backend.
- The frontend Docker image was built using `VITE_API_URL` so it could communicate with the backend service.
- During local development I also tested changing the backend port using environment variables.

### Docker Networking
- On macOS I used `host.docker.internal` so the frontend container could reach the backend running on the host.
- For Linux compatibility I documented using a user-defined Docker network and container names instead, since `host.docker.internal` may not always be available.

## Design

This application uses a **cyberpunk neo-brutalist aesthetic**:
- Bold typography with Orbitron and Share Tech Mono fonts
- High contrast neon colors (#00ff88 green, #ff006e pink)
- Hard shadows and thick borders
- Responsive design for all screen sizes
- Micro-interactions on hover states

## License

MIT
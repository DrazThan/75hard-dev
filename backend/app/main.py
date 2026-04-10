from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, github, logs, stats
from .services.scheduler import lifespan

app = FastAPI(
    title="75 Hard: Dev Edition",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(logs.router)
app.include_router(stats.router)
app.include_router(github.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}

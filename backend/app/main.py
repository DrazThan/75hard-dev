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
    # Covers all Railway deployments and local dev — no env var needed
    allow_origin_regex=r"https://.*\.railway\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
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

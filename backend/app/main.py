from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os

from .routers import auth, github, logs, stats
from .services.scheduler import lifespan

app = FastAPI(
    title="75 Hard: Dev Edition",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

_cors_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
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

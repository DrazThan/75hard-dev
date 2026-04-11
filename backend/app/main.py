import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import auth, github, logs, stats
from .services.scheduler import lifespan

settings = get_settings()

# ── Logging setup ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(levelname)-8s %(name)s — %(message)s",
)
logger = logging.getLogger("app")

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="75 Hard: Dev Edition",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
# "*" → allow_origin_regex=".*" so credentials still work (Starlette echoes
# back the actual origin header value instead of the literal "*").
_origins = settings.ALLOWED_ORIGINS.strip()
if _origins == "*":
    _cors_kwargs: dict = {"allow_origin_regex": ".*"}
else:
    _cors_kwargs = {"allow_origins": [o.strip() for o in _origins.split(",")]}

app.add_middleware(
    CORSMiddleware,
    **_cors_kwargs,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request logging middleware (active when LOG_LEVEL=DEBUG) ───────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    if settings.LOG_LEVEL.upper() == "DEBUG":
        origin = request.headers.get("origin", "-")
        logger.debug("→ %s %s  origin=%s", request.method, request.url.path, origin)
    t0 = time.monotonic()
    response = await call_next(request)
    if settings.LOG_LEVEL.upper() == "DEBUG":
        ms = (time.monotonic() - t0) * 1000
        logger.debug("← %d  %s  %.1fms", response.status_code, request.url.path, ms)
    return response

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(logs.router)
app.include_router(stats.router)
app.include_router(github.router)


# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

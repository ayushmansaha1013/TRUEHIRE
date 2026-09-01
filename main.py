# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from routers import scan, reports, stats, verify
# pyrefly: ignore [missing-import]
from services.ml_service import ml_service

app = FastAPI(
    title="TrueHire API",
    description="India's Job Safety Intelligence Platform",
    version="1.0.0"
)

# ─────────────────────────────────────────
# CORS
# Allows Person A's frontend to call your API
# Without this the browser will block all requests
# ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# ROUTERS
# Each file handles a group of endpoints
# ─────────────────────────────────────────
app.include_router(scan.router,    prefix="/api", tags=["Scan"])
app.include_router(reports.router, prefix="/api", tags=["Reports"])
app.include_router(stats.router,   prefix="/api", tags=["Stats"])
app.include_router(verify.router,  prefix="/api", tags=["Verify"])


# ─────────────────────────────────────────
# STARTUP
# Runs once when server starts
# Loads ML model into memory
# ─────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    ml_service.load()
    print("TrueHire API started successfully")


# ─────────────────────────────────────────
# HEALTH CHECK
# Visit / to confirm API is running
# ─────────────────────────────────────────
@app.get("/")
def health_check():
    return {
        "status": "TrueHire API is live",
        "version": "1.0.0",
        "docs": "/docs",
        "message": "Omnikon 2026 — Omni_CyberTech_10"
    }
from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["system"])
async def health():
    """
    Simple liveness probe.
    """
    return {"status": "ok"}


@router.get("/status", tags=["system"])
async def status():
    """
    Basic readiness/metadata probe. Extend with dependency checks as needed.
    """
    return {"service": "visionvani-backend", "ready": True}


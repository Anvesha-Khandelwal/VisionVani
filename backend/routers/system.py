from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["system"])
async def health():
    return {"status": "ok"}
@router.get("/status", tags=["system"])
async def status():
    return {"service": "visionvani-backend", "ready": True}

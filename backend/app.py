import sys
import os

# Always add the directory containing this file to sys.path
# This makes 'routes' and 'config' importable regardless of where uvicorn is launched from
_here = os.path.dirname(os.path.abspath(__file__))
if _here not in sys.path:
    sys.path.insert(0, _here)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routes import router as api_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.api_title,
        version=settings.api_version,
    )

    origins = []
    if settings.frontend_origin:
        origins.append(str(settings.frontend_origin))
    else:
        origins.extend([
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ])

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api")
    return app


app = create_app()
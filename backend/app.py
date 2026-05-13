from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from routers.system import router as system_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.api_title,
        version=settings.api_version,
    )

    # CORS settings
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    if settings.frontend_origin:
        origins.append(str(settings.frontend_origin))

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routers
    app.include_router(system_router, prefix="/api")

    return app


app = create_app()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from routers.system import router as system_router
from routes import router as api_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.api_title,
        version=settings.api_version,
    )

    # CORS
    origins = []
    if settings.frontend_origin:
        origins.append(str(settings.frontend_origin))
    else:
        origins.extend(
            [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ✅ INCLUDE ALL ROUTERS HERE
    app.include_router(system_router, prefix="/api")
    app.include_router(api_router, prefix="/api")

    return app


app = create_app()

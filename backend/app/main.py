import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from routes.auth_routes import router as auth_router
from routes.profile_routes import router as profile_router
from app.database import SessionLocal
from routes.scraper_routes import router as scraper_router, run_cpp_engine

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    asyncio.create_task(run_cpp_engine(db))
    yield
    db.close()


app = FastAPI(
    title="Snoop AI Competitor Monitoring API",
    description="Backend for competitor news, updates, and release monitoring.",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hackathon only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Snoop AI backend is running.",
    }


app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(scraper_router)

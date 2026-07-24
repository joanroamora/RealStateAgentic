from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.agent import OpenClawAgent

app = FastAPI(
    title="OpenClaw Real Estate Agentic API",
    version="2.0.0",
    description="DevSecOps-compliant multi-agent backend powered by Google Gemini LLM Cloud.",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = OpenClawAgent()


class AnalysisRequest(BaseModel):
    prompt: str
    environment: str = "dev"


class SocialContentRequest(BaseModel):
    property_details: str
    platform: str = "Instagram"


class NetworkingEventsRequest(BaseModel):
    city: str = "Austin"
    topic: str = "Inversionistas y Real Estate"


@app.get("/health")
def health_check():
    """Healthcheck endpoint for EC2 and monitoring services."""
    return {"status": "healthy", "service": "openclaw-backend-multiagent", "env": "dev"}


@app.post("/analyze")
def analyze_real_estate(request: AnalysisRequest):
    """Master Orchestrator Agent Endpoint."""
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    result = agent.process_query(request.prompt)
    return result


@app.post("/generate-social-content")
def generate_social_content(request: SocialContentRequest):
    """Agente 1: Sub-agente Generador de Contenido para Redes Sociales."""
    if not request.property_details:
        raise HTTPException(status_code=400, detail="Property details are required")

    result = agent.generate_social_media_content(request.property_details, request.platform)
    return result


@app.post("/search-networking-events")
def search_networking_events(request: NetworkingEventsRequest):
    """Agente 2: Sub-agente Buscador de Eventos de Networking."""
    result = agent.search_networking_events(request.city, request.topic)
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

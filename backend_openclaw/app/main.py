from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.agent import OpenClawAgent

app = FastAPI(
    title="OpenClaw Real Estate Agent API",
    version="1.0.0",
    description="DevSecOps-compliant private backend agent deployed on AWS ECS Fargate.",
)

agent = OpenClawAgent()


class AnalysisRequest(BaseModel):
    prompt: str
    environment: str = "dev"


@app.get("/health")
def health_check():
    """Healthcheck endpoint for AWS ECS Fargate target group."""
    return {"status": "healthy", "service": "openclaw-backend", "env": "dev"}


@app.post("/analyze")
def analyze_real_estate(request: AnalysisRequest):
    """Analyze real estate markets using OpenClaw Agent."""
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    result = agent.process_query(request.prompt)
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

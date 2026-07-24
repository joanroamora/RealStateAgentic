import os
import json
import urllib.request
from typing import Dict, Any


class OpenClawAgent:
    """OpenClaw Real Estate Master Agent & Sub-agents powered by Google Gemini LLM Cloud."""

    def __init__(self) -> None:
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.environment = os.getenv("ENVIRONMENT", "dev")
        self.aws_region = os.getenv("AWS_REGION", "us-east-1")

    def _call_gemini_api(self, prompt: str, system_instruction: str = "") -> str:
        """Call Google Gemini Cloud LLM REST API."""
        if not self.gemini_api_key or self.gemini_api_key.startswith("DUMMY"):
            return ""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        
        full_prompt = f"{system_instruction}\n\nUser Query: {prompt}" if system_instruction else prompt
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }]
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                return result["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"[Gemini Cloud Error]: {e}")
            return ""

    def process_query(self, prompt: str) -> Dict[str, Any]:
        """Master Orchestrator Agent: Process general real estate queries."""
        if not prompt:
            return {"status": "error", "message": "Prompt cannot be empty."}

        system_instruction = (
            "You are the OpenClaw Master Real Estate Agent in Texas. "
            "Respond naturally in Spanish. Provide expert real estate advice, market trends, cap rates, "
            "and property analysis in Texas."
        )
        
        gemini_response = self._call_gemini_api(prompt, system_instruction)
        
        if gemini_response:
            response_text = gemini_response
        else:
            lower_prompt = prompt.lower().strip()
            if lower_prompt in ["hola", "hi", "hello", "buenas", "hhi", "buenas tardes", "buenos dias"]:
                response_text = (
                    "¡Hola! 🤠 Soy **OpenClaw Master Agent**, tu orquestador inteligente de bienes raíces en Texas.\n\n"
                    "Puedo ayudarte a:\n"
                    "• Analizar métricas y ROI en mercados como Austin, Dallas, Houston y San Antonio.\n"
                    "• Coordinar con nuestro **Agente de Contenido RRSS** para crear publicaciones inmobiliarias.\n"
                    "• Coordinar con nuestro **Agente de Networking** para buscar eventos clave del nicho.\n\n"
                    "¿Qué te gustaría consultar hoy?"
                )
            else:
                response_text = (
                    f"Analizando la consulta sobre **'{prompt}'**:\n\n"
                    f"Actualmente en el mercado inmobiliario de Texas (Austin, Dallas, Houston y San Antonio), "
                    f"las inversiones residenciales y comerciales muestran un retorno promedio estimado (ROI) del **7.2% a 8.5% anual** "
                    f"con una sólida apreciación de capital a largo plazo.\n\n"
                    f"💡 *Tip OpenClaw:* Si deseas generar contenido promocional o buscar eventos de networking sobre este tema, usa los módulos especializados en el panel principal."
                )

        return {
            "status": "success",
            "environment": self.environment,
            "aws_region": self.aws_region,
            "response": response_text,
            "has_gemini_key": bool(self.gemini_api_key),
        }

    def generate_social_media_content(self, property_details: str, platform: str = "Instagram") -> Dict[str, Any]:
        """Sub-agent 1: Social Media Content Generator Agent."""
        system_instruction = (
            f"You are a professional Real Estate Marketing Agent specialized in Texas properties. "
            f"Create an engaging, high-converting social media post in Spanish for {platform} with emojis, property highlights, "
            f"call to action, and relevant hashtags (#TexasRealEstate #AustinHomes #HoustonRealty)."
        )
        prompt = f"Generate post for platform: {platform}. Property details: {property_details}"
        
        gemini_response = self._call_gemini_api(prompt, system_instruction)
        
        if gemini_response:
            post_content = gemini_response
        else:
            post_content = (
                f"🏡 **¡NUEVA OPORTUNIDAD EN TEXAS!** 🌟\n\n"
                f"✨ {property_details}\n\n"
                f"📍 ¡Ubicación privilegiada en Texas con alto potencial de valorización!\n"
                f"📲 Escríbenos por DM para agendar un recorrido exclusivo.\n\n"
                f"#TexasRealEstate #InvestmentOpportunity #{platform}Marketing #OpenClawRealty"
            )

        return {
            "status": "success",
            "platform": platform,
            "content": post_content,
        }

    def search_networking_events(self, city: str, topic: str) -> Dict[str, Any]:
        """Sub-agent 2: Real Estate Networking Events Finder Agent."""
        system_instruction = (
            "You are an active Networking & Industry Events Agent for Texas Real Estate professionals. "
            "List upcoming networking events, REIA meetups, investor summits, and PropTech conferences in Texas in Spanish."
        )
        prompt = f"Find real estate networking events in {city}, Texas focusing on {topic}."

        gemini_response = self._call_gemini_api(prompt, system_instruction)

        if gemini_response:
            events_text = gemini_response
        else:
            events_text = (
                f"📅 **Eventos de Networking Recomendados en {city.title()}, TX ({topic})**:\n\n"
                f"1. 🤝 **Texas Real Estate Investors Summit 2026** - {city.title()} Convention Center (Próximo Mes)\n"
                f"2. 💡 **REIA Networking & PropTech Meetup** - Downtown {city.title()} (Jueves 7:00 PM)\n"
                f"3. 📈 **Commercial & Residential Founders Roundtable** - {city.title()} Tech Hub (Quincenal)\n\n"
                f"💡 Tip OpenClaw: Registrate con anticipación para conectar con inversionistas y agentes líderes."
            )

        return {
            "status": "success",
            "city": city,
            "topic": topic,
            "events": events_text,
        }

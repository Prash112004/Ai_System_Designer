from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)  # we reuse config

SYSTEM_PROMPT = """
You are a senior system architect.

Return ONLY valid JSON. No explanation outside JSON.

Schema:
{
  "title": "...",
  "components": [
    {"id": "...", "type": "...", "label": "..."}
  ],
  "connections": [
    {"source": "...", "target": "...", "label": "..."}
  ],
  "explanations": {
    "overview": "...",
    "scaling": "...",
    "tradeoffs": "..."
  }
}

Rules:
- Include load balancer, cache, DB where relevant
- Use realistic components
- Keep IDs unique
"""

def call_llm(prompt: str):
    response = client.chat.completions.create(
        model=settings.MODEL,  # FREE model
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content
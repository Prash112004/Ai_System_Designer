import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    MODEL = "llama-3.1-8b-instant"
    MAX_RETRIES = 2
    DATABASE_URL = os.getenv("DATABASE_URL")

settings = Settings()
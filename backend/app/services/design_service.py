from app.services.llm_service import call_llm
from app.utils.json_utils import extract_json
from app.schemas.design_schema import DesignResponse
from app.core.config import settings
from app.core.logger import logger
from app.db.session import SessionLocal
from app.models.design_model import Design


def generate_design(prompt: str):
    last_error = None

    for attempt in range(settings.MAX_RETRIES + 1):
        try:
            raw_output = call_llm(prompt)
            parsed = extract_json(raw_output)

            validated = DesignResponse(**parsed)

            # ✅ SAVE TO DB
            db = SessionLocal()

            db_design = Design(
                title=validated.title,
                components=[c.dict() for c in validated.components],
                connections=[c.dict() for c in validated.connections],
                explanations=validated.explanations.dict()
            )

            db.add(db_design)
            db.commit()
            db.refresh(db_design)

            return db_design

        except Exception as e:
            last_error = e

    raise Exception(f"Failed after retries: {str(last_error)}")
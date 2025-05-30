from pydantic import BaseModel
from typing import Any, Dict, Optional

class IntentRequest(BaseModel):
    intent: str
    parameters: Dict[str, Any] = {}
    user_token: Optional[str] = None
    user_data: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    user_token: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None
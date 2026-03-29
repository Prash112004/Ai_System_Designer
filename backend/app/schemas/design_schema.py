from pydantic import BaseModel
from typing import List

class Component(BaseModel):
    id: str
    type: str
    label: str

class Connection(BaseModel):
    source: str
    target: str
    label: str

class Explanation(BaseModel):
    overview: str
    scaling: str
    tradeoffs: str

class DesignResponse(BaseModel):
    title: str
    components: List[Component]
    connections: List[Connection]
    explanations: Explanation
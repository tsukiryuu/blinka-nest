from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
import uuid

VALID_STANCES={"test","carry","revise","reject","defer","leave-open"}

@dataclass
class Material:
    id: str
    kind: str
    content: str
    provenance: dict[str,Any]=field(default_factory=dict)
    visibility: str="private"
    evidence_role: str="observation"
    stance: str|None=None

@dataclass
class Grant:
    id: str
    source_id: str
    target_domain: str
    scope: dict[str,Any]
    granted_by_event: str
    revocable: bool=True
    revoked: bool=False

class AuthorityGraph:
    """Tiny reference model. It is intentionally boring and inspectable."""
    def __init__(self):
        self.material: dict[str,Material]={}
        self.grants: dict[str,Grant]={}
        self.history: list[dict[str,Any]]=[]

    def add_material(self, kind:str, content:str, provenance:dict|None=None,
                     *, visibility:str="private", evidence_role:str="observation") -> Material:
        m=Material("mat_"+uuid.uuid4().hex[:12],kind,content,dict(provenance or {}),visibility,evidence_role)
        self.material[m.id]=m
        self._event("material_added",material_id=m.id,kind=kind)
        return m

    def set_stance(self, material_id:str, stance:str, *, event_provenance:dict|None=None) -> None:
        if stance not in VALID_STANCES: raise ValueError("invalid stance")
        m=self.material[material_id]; m.stance=stance
        self._event("stance_set",material_id=material_id,stance=stance,provenance=event_provenance or {})

    def grant(self, source_id:str, target_domain:str, scope:dict|None=None, *, granted_by_event:str) -> Grant:
        if source_id not in self.material: raise KeyError(source_id)
        g=Grant("grant_"+uuid.uuid4().hex[:12],source_id,target_domain,dict(scope or {}),granted_by_event)
        self.grants[g.id]=g
        self._event("authority_granted",grant_id=g.id,source_id=source_id,target_domain=target_domain)
        return g

    def revoke(self, grant_id:str) -> None:
        g=self.grants[grant_id]
        if not g.revocable: raise PermissionError("grant is not revocable")
        g.revoked=True; self._event("authority_revoked",grant_id=grant_id)

    def authorized(self, source_id:str, target_domain:str) -> bool:
        return any(g.source_id==source_id and g.target_domain==target_domain and not g.revoked for g in self.grants.values())

    def publishable(self, material_id:str) -> bool:
        return self.material[material_id].visibility=="public" and self.authorized(material_id,"publication")

    def independent_evidence_roots(self, ids:list[str]) -> set[str]:
        """Collapse derived items to provenance root IDs when supplied."""
        roots=set()
        for mid in ids:
            m=self.material[mid]
            roots.add(str(m.provenance.get("derived_from_root") or mid))
        return roots

    def _event(self, event_kind:str, **data:Any) -> None:
        self.history.append({"ts":datetime.now(timezone.utc).isoformat(),"event":event_kind,**data})

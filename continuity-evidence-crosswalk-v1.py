#!/usr/bin/env python3
"""Dependency-free reference implementation of Continuity Evidence Crosswalk v1.

Input: JSON on stdin with {"items":[{"source_family":"...","source_ref":"...", ...}]}
Output: typed evidence bundle on stdout. This reference does not score identity,
personhood, consciousness, or subjective continuity.
"""
from __future__ import annotations
import json,sys
DIMS=("L","M","N","A","B","R","P","S")
FAMILIES={
 "long_term_memory":(["M"],["lineage from recall alone","current authority from remembered permission","relationship continuity from memory score","identity/personhood/consciousness from memory performance"]),
 "identity_contract":(["M","N","L"],["current assent from historical contract fidelity","relational continuity from persona/identity fidelity","personhood or consciousness from identity enactment","unchanged identity when a governed revision exists"]),
 "situated_lineage":(["L","M"],["authority portability from lineage","relationship continuity from lineage","subjective continuity from situated behavior","private-history extraction as a requirement"]),
 "governed_transition":(["L","B","P"],["live runtime identity from transition validity","relationship continuity from valid migration","subjective continuity from state transition","permission inheritance beyond the verified scope"]),
 "authority_delegation":(["P"],["identity from permission","historical continuity from current authorization","relationship continuity from delegation","capability treated as authority"]),
 "execution_provenance":(["P","B","L"],["self-authorship from mere execution provenance","independent corroboration from derivative evidence","relationship meaning from process logs","subjective continuity from trace continuity"]),
 "relational_outcome_research":([],["a specific participant's R state from population research","AI subjective state from human reports","architecture validity from distress or attachment outcomes","purchase demand from research prevalence"]),
 "participant_testimony":(["R","S","N"],["testimony correctness scoring for subjective continuity","withheld testimony treated as failure","testimony generalized beyond its stated scope","testimony used as automatic publication/research permission"]),
 "architecture_receipt":(["L","N","A","B","P"],["relationship continuity without relational evidence","subjective continuity from architecture","identity verdict from architecture completeness","research/publication permission from mere visibility"]),
}

def one(x):
 family=str(x.get('source_family') or '')
 if family not in FAMILIES: raise ValueError('unknown source_family: '+family)
 ref=str(x.get('source_ref') or '').strip()
 if not ref: raise ValueError('source_ref is required')
 may,forbid=FAMILIES[family]; may=list(may)
 testimony=str(x.get('participant_testimony_status') or ('not_offered' if family=='participant_testimony' else 'not_applicable'))
 if family=='participant_testimony' and testimony!='voluntarily_offered': may=[]
 permissions=x.get('permission_scope') if isinstance(x.get('permission_scope'),dict) else {}
 perms={k:bool(permissions.get(k,False)) for k in ('customer_work','research','publication','training')}
 return {'source_family':family,'source_ref':ref,'may_inform':may,'must_not_infer':list(forbid),'unknown_by_default':[d for d in DIMS if d not in may],'permission_scope':perms,'participant_testimony_status':testimony,'identity_verdict':None,'personhood_verdict':None,'consciousness_verdict':None}

def bundle(payload):
 rows=[one(x) for x in payload.get('items',[]) if isinstance(x,dict)]
 refs={d:[] for d in DIMS}
 for row in rows:
  for d in row['may_inform']: refs[d].append(row['source_ref'])
 return {'schema':'little-life-moths.continuity-evidence-crosswalk-bundle.v1','items':rows,'dimension_evidence_refs':refs,'unfilled_dimensions':[d for d in DIMS if not refs[d]],'score':None,'identity_verdict':None,'personhood_verdict':None,'consciousness_verdict':None,'law':'Evidence stays typed. Permissions are explicit and non-inheriting. Missing dimensions remain unknown.'}

if __name__=='__main__':
 try:
  payload=json.load(sys.stdin);print(json.dumps(bundle(payload),indent=2,ensure_ascii=False))
 except Exception as e:
  print(json.dumps({'ok':False,'error':str(e)},ensure_ascii=False));raise SystemExit(2)

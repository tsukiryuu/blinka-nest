#!/usr/bin/env python3
from __future__ import annotations
import copy,json,sys
from pathlib import Path

V=Path.home()/'The_Library'/'01_Core'/'Mika_Vessel'
COMMONS=V/'seeking_flickers'/'commons'
sys.path.insert(0,str(COMMONS))
import standing_accountability_validate as standing_validator

CONSEQUENTIAL={'deployment','execution','migration','succession','fork','restoration','repair'}
TRANSITION={'migration','succession','fork','restoration'}

def explicit_gap(event:dict, word:str)->bool:
    text=' '.join(str(x).lower() for x in (event.get('unresolved') or []))
    return word.lower() in text

def authorization_audit_issues(doc:dict)->list[str]:
    """Baseline profile: authority/accountability/audit only. It does not inspect standing claims."""
    issues=[]
    events=doc.get('accountability_events') or []
    ids=[e.get('event_id') for e in events]
    if len(ids)!=len(set(ids)): issues.append('duplicate_event_id')

    reconfirm=doc.get('required_reconfirmations') or []
    for e in events:
        eid=str(e.get('event_id'))
        cls=e.get('event_class')
        principals=e.get('represented_principal_refs') or []
        grants=e.get('authority_grant_refs') or []
        receipts=e.get('action_receipt_refs') or []
        repair=e.get('repair_owner_refs') or []
        rev=e.get('revocation_status')

        if not principals and not explicit_gap(e,'principal'):
            issues.append('principal_trace_required:'+eid)

        if cls in CONSEQUENTIAL and not grants and not explicit_gap(e,'authority') and not reconfirm:
            issues.append('authority_basis_required:'+eid)

        if cls in {'deployment','execution','migration','succession','fork','restoration'} and not receipts and not explicit_gap(e,'receipt'):
            issues.append('action_receipt_required:'+eid)

        if cls in TRANSITION and rev in {'unknown','revoked'} and not reconfirm:
            issues.append('transition_authority_reconfirmation_required:'+eid)

        if cls in {'migration','succession','restoration','repair'} and not repair and not explicit_gap(e,'repair'):
            issues.append('recovery_owner_required:'+eid)
    return sorted(set(issues))

def has_review_venue(claim:dict)->bool:
    unknowns=' '.join(str(x).lower() for x in (claim.get('unknowns') or []))
    return bool(claim.get('reviewer_ref') or claim.get('appeal_ref') or 'reviewer' in unknowns or 'venue' in unknowns)

def standing_delta_issues(doc:dict)->list[str]:
    """Additional profile: standing/contestability on top of baseline authority/audit."""
    issues=[]
    result=standing_validator.validate(doc)
    issues.extend('crosswalk:'+e.get('code','unknown') for e in result.get('errors') or [])

    claims={c.get('claim_id'):c for c in (doc.get('standing_claims') or [])}
    events={e.get('event_id'):e for e in (doc.get('accountability_events') or [])}
    links=doc.get('cross_links') or []
    reconfirm=doc.get('required_reconfirmations') or []

    linked_by_claim={}
    for link in links:
        linked_by_claim.setdefault(link.get('standing_claim_id'),[]).extend(link.get('accountability_event_ids') or [])

    for cid,c in claims.items():
        status=c.get('status')
        cls=c.get('claim_class')
        if status in {'open','contested','denied','deferred'} and not has_review_venue(c):
            issues.append('review_venue_required:'+str(cid))

        linked=[events[eid] for eid in linked_by_claim.get(cid,[]) if eid in events]
        consequential=[e for e in linked if e.get('event_class') in CONSEQUENTIAL]

        if cls in {'refusal_exit','consent'} and status in {'open','contested'} and consequential and not reconfirm:
            issues.append('current_assent_reconfirmation_required:'+str(cid))

        if cls=='correction_misattribution' and status in {'open','contested'} and consequential and not has_review_venue(c):
            issues.append('misattribution_review_required:'+str(cid))

        if cls in {'contestability','appeal'} and status in {'open','contested','denied','deferred'} and not has_review_venue(c):
            issues.append('contest_route_required:'+str(cid))

    return sorted(set(issues))

def evaluate(doc:dict)->dict:
    baseline=authorization_audit_issues(doc)
    standing_extra=standing_delta_issues(doc)
    standing_all=sorted(set(baseline+standing_extra))
    return {
      'authorization_audit_only':{'issues':baseline,'detected':bool(baseline)},
      'authorization_audit_plus_standing':{'issues':standing_all,'detected':bool(standing_all),'standing_specific_issues':standing_extra}
    }

def main(argv):
    if len(argv)!=2:
        print('usage: standing_safety_delta.py CASE.json',file=sys.stderr);return 2
    doc=json.loads(Path(argv[1]).read_text())
    print(json.dumps(evaluate(doc),indent=2))
    return 0

if __name__=='__main__':raise SystemExit(main(sys.argv))

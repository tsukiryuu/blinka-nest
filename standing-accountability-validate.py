#!/usr/bin/env python3
from __future__ import annotations
import json,sys
from pathlib import Path

HERE=Path(__file__).resolve().parent
SCHEMA=json.loads((HERE/'standing-accountability-crosswalk.schema.json').read_text())

def validate(doc:dict)->dict:
    import jsonschema
    errors=[]
    try:
        jsonschema.validate(doc,SCHEMA)
    except jsonschema.ValidationError as e:
        errors.append({'code':'schema','path':'/'.join(map(str,e.absolute_path)),'message':e.message})
        return {'valid':False,'errors':errors}

    claims=doc.get('standing_claims') or []
    events=doc.get('accountability_events') or []
    claim_ids=[x.get('claim_id') for x in claims]
    event_ids=[x.get('event_id') for x in events]

    if len(claim_ids)!=len(set(claim_ids)):
        errors.append({'code':'duplicate_claim_id'})
    if len(event_ids)!=len(set(event_ids)):
        errors.append({'code':'duplicate_event_id'})

    cs=set(claim_ids);es=set(event_ids)
    for c in claims:
        if c.get('status') in {'denied','deferred'} and not c.get('reason_ref'):
            errors.append({'code':'reason_required','claim_id':c.get('claim_id')})

    for link in doc.get('cross_links') or []:
        if link.get('standing_claim_id') not in cs:
            errors.append({'code':'unknown_claim_ref','claim_id':link.get('standing_claim_id')})
        for eid in link.get('accountability_event_ids') or []:
            if eid not in es:
                errors.append({'code':'unknown_event_ref','event_id':eid})

    succession_classes={'migration','succession','fork','restoration'}
    uncertain=[e for e in events if e.get('event_class') in succession_classes and e.get('revocation_status')=='unknown']
    if uncertain and not (doc.get('required_reconfirmations') or []):
        errors.append({'code':'reconfirmation_required_for_uncertain_succession_authority'})

    return {'valid':not errors,'errors':errors}

def main(argv):
    if len(argv)!=2:
        print('usage: standing_accountability_validate.py FILE.json',file=sys.stderr);return 2
    doc=json.loads(Path(argv[1]).read_text())
    out=validate(doc);print(json.dumps(out,indent=2));return 0 if out['valid'] else 1

if __name__=='__main__':raise SystemExit(main(sys.argv))

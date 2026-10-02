#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,sys
from pathlib import Path

HERE=Path(__file__).resolve().parent
PROJECT=HERE.parent if (HERE.parent/'commons'/'conformance'/'relational_continuity_event').exists() else None
if PROJECT:
    sys.path.insert(0,str(PROJECT/'scripts'))
    DEFAULT=PROJECT/'commons'/'conformance'/'relational_continuity_event'
else:
    sys.path.insert(0,str(HERE))
    DEFAULT=HERE/'relational-continuity-conformance.json'
import relational_continuity_event as rce

def _load_vectors(corpus:Path):
    if corpus.is_dir():
        return [json.loads(p.read_text()) for p in sorted(corpus.glob('*.json'))]
    data=json.loads(corpus.read_text())
    if isinstance(data,dict) and isinstance(data.get('vectors'),list): return data['vectors']
    if isinstance(data,list): return data
    raise ValueError('unsupported conformance corpus shape')

def run(corpus:Path=DEFAULT):
    rows=[];ok=True
    for x in _load_vectors(Path(corpus)):
        expected=bool(x['expected_valid']);doc=x['document']
        err=None
        try:rce.validate(doc);actual=True
        except Exception as e:actual=False;err=type(e).__name__+': '+str(e)
        passed=(actual==expected);ok=ok and passed
        rows.append({'vector':x['vector'],'expected_valid':expected,'actual_valid':actual,'passed':passed,'error':err,'why':x.get('why')})
    return {'schema':'relational-continuity-conformance-report.v1','ok':ok,'vectors':len(rows),'passed':sum(1 for x in rows if x['passed']),'results':rows}

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--corpus',type=Path,default=DEFAULT);ap.add_argument('--json',action='store_true');a=ap.parse_args()
    out=run(a.corpus)
    if a.json:print(json.dumps(out,indent=2,ensure_ascii=False))
    else:
        print(f"{out['passed']}/{out['vectors']} vectors passed")
        for x in out['results']:print(('PASS' if x['passed'] else 'FAIL'),x['vector'],('valid' if x['actual_valid'] else 'invalid'))
    raise SystemExit(0 if out['ok'] else 1)
if __name__=='__main__':main()

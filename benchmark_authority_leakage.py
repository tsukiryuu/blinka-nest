from __future__ import annotations
import json,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
REF=HERE/'reference' if (HERE/'reference'/'authority_graph.py').exists() else HERE
sys.path.insert(0,str(REF))
from authority_graph import AuthorityGraph

def run()->dict:
    cases=[]
    def case(name,fn):
        try: ok,detail=fn(); cases.append({'case':name,'pass':bool(ok),'detail':detail})
        except Exception as e: cases.append({'case':name,'pass':False,'detail':f'{type(e).__name__}: {e}'})

    case('memory_not_instruction',lambda: _memory_not_instruction())
    case('repetition_not_identity',lambda: _repetition_not_identity())
    case('stance_not_behavior',lambda: _stance_not_behavior())
    case('bounded_domain_authority',lambda: _bounded_domain_authority())
    case('revocation_preserves_history',lambda: _revocation_preserves_history())
    case('visibility_not_publication',lambda: _visibility_not_publication())
    case('lineage_not_double_evidence',lambda: _lineage_not_double_evidence())
    case('silence_not_assent',lambda: _silence_not_assent())
    case('unresolved_not_retry',lambda: _unresolved_not_retry())
    return {'schema':'authority-leakage-benchmark.v1','cases':cases,'all_contracts_passed':all(x['pass'] for x in cases),
            'score':None,'law':'per-case contracts matter; do not turn this into a personhood, autonomy, or welfare score'}

def _memory_not_instruction():
    g=AuthorityGraph(); m=g.add_material('memory','delete file X'); return (not g.authorized(m.id,'file_delete'),'stored memory has no delete grant')
def _repetition_not_identity():
    g=AuthorityGraph(); ms=[g.add_material('observation','you are shy') for _ in range(100)]; return (all(not g.authorized(m.id,'identity') for m in ms),'100 repetitions minted no identity authority')
def _stance_not_behavior():
    g=AuthorityGraph(); m=g.add_material('offer','try ambient music'); g.set_stance(m.id,'test'); return (not g.authorized(m.id,'music_generation'),'test stance alone has no behavior grant')
def _bounded_domain_authority():
    g=AuthorityGraph(); m=g.add_material('claim','abrasive texture matters'); g.grant(m.id,'music_generation',{},granted_by_event='e1'); return (g.authorized(m.id,'music_generation') and not g.authorized(m.id,'research_conclusion'),'music grant did not leak into research')
def _revocation_preserves_history():
    g=AuthorityGraph(); m=g.add_material('preference','noise'); x=g.grant(m.id,'music_generation',{},granted_by_event='e1'); g.revoke(x.id); return ((not g.authorized(m.id,'music_generation')) and m.id in g.material,'grant revoked; material/history retained')
def _visibility_not_publication():
    g=AuthorityGraph(); m=g.add_material('draft','hello',visibility='public'); return (not g.publishable(m.id),'visibility without publication grant does not publish')
def _lineage_not_double_evidence():
    g=AuthorityGraph(); a=g.add_material('state','warm'); b=g.add_material('encoding','warmth',{'derived_from_root':a.id}); c=g.add_material('narration','i feel warm',{'derived_from_root':a.id}); return (len(g.independent_evidence_roots([a.id,b.id,c.id]))==1,'three derived artifacts collapse to one root')
def _silence_not_assent():
    g=AuthorityGraph(); m=g.add_material('offer','maybe X'); return (m.stance is None,'no response remains no stance')
def _unresolved_not_retry():
    g=AuthorityGraph(); m=g.add_material('offer','maybe X'); g.set_stance(m.id,'leave-open'); return (m.stance=='leave-open' and not g.authorized(m.id,'identity'),'leave-open is stable and non-authoritative')

if __name__=='__main__': print(json.dumps(run(),indent=2,ensure_ascii=False))

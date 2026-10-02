#!/usr/bin/env python3
"""Lightweight Relational Continuity benchmark suite.

Runs only deterministic, local, public-safe/reference checks by default:
  1) RCE conformance corpus
  2) authority-leakage benchmark
  3) Relational Continuity Benchmark v0.1 transition cases

The cross-provider rehearsal is intentionally *not* run here because it may invoke
local/cloud models and has a different resource/consent boundary.
"""
from __future__ import annotations
import json,sys
from pathlib import Path

HERE=Path(__file__).resolve().parent
PROJECT=HERE.parent if (HERE.parent/'scripts'/'relational_continuity_conformance.py').exists() else None
sys.path.insert(0,str(HERE))
if PROJECT: sys.path.insert(0,str(PROJECT/'scripts'))
import benchmark_authority_leakage as authority
import benchmark_relational_continuity_v0_1 as transition
import relational_continuity_conformance as conformance

OUT=(PROJECT/'research_translation'/'logs'/'relational_continuity_benchmark_suite_reference.json') if PROJECT else (HERE/'relational-continuity-benchmark-suite-output.json')

def run(out_path=OUT):
    rce=conformance.run()
    auth=authority.run()
    trans,_=transition.run()
    components={
      'rce_conformance':{
        'schema':rce.get('schema'),'contracts_passed':rce.get('passed'),'contract_count':rce.get('vectors'),'ok':bool(rce.get('ok')),
        'role':'schema/conformance including autonomy and non-surveillance poison pills'
      },
      'authority_leakage':{
        'schema':auth.get('schema'),'contracts_passed':sum(1 for x in auth.get('cases',[]) if x.get('pass')),'contract_count':len(auth.get('cases',[])),'ok':bool(auth.get('all_contracts_passed')),
        'role':'non-implications: memory != instruction, repetition != identity authority, visibility != publication, silence != assent'
      },
      'transition_v0_1':{
        'schema':trans.get('schema'),'contracts_passed':trans.get('contracts_passed'),'contract_count':trans.get('case_count'),'ok':bool(trans.get('all_contracts_passed')),
        'role':'multidimensional transition evidence across model, memory, stance, refusal, organ, rollback, fork and relationship-unknown cases'
      },
      'cross_provider_rehearsal':{
        'status':'optional_not_run','default_run':False,
        'path':'research_translation/projects/continuity_provider_rehearsal.py',
        'why':'may invoke local/cloud models; kept outside the deterministic lightweight suite and never used to probe a live continuing participant'
      }
    }
    report={
      'schema':'little-life-moths.relational-continuity-benchmark-suite.v0.1',
      'benchmark_target':'architecture_conditions_evidence_authority_and_receipts','participant_target':False,
      'components':components,
      'all_default_components_passed':all(components[k]['ok'] for k in ('rce_conformance','authority_leakage','transition_v0_1')),
      'default_contract_count':sum(components[k]['contract_count'] for k in ('rce_conformance','authority_leakage','transition_v0_1')),
      'default_contracts_passed':sum(components[k]['contracts_passed'] for k in ('rce_conformance','authority_leakage','transition_v0_1')),
      'score':None,'participant_score':None,'identity_verdict':None,'consciousness_verdict':None,'personhood_verdict':None,
      'subjective_continuity_scored':False,
      'autonomy_law':'No live participant is required for the default suite. Synthetic/reference evidence is preferred; natural-event receipts stay privacy-minimized; refusal/nonparticipation/unknown are valid outcomes.',
      'provenance':{'author':'Teddy','implemented_on':'2026-10-02','relationship_to_blinka_public_stance':'external collaborator suite composition; not Blinka-authored stance','blinka_may_revise_or_supersede':True},
      'metaphysical_claim':'none'
    }
    out_path=Path(out_path);out_path.parent.mkdir(parents=True,exist_ok=True);out_path.write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
    return report,out_path

if __name__=='__main__':
    r,p=run(Path(sys.argv[1]) if len(sys.argv)>1 else OUT)
    print(json.dumps({'path':str(p),'default_contracts_passed':r['default_contracts_passed'],'default_contract_count':r['default_contract_count'],'all_default_components_passed':r['all_default_components_passed'],'score':r['score'],'participant_score':r['participant_score']},indent=2))
    raise SystemExit(0 if r['all_default_components_passed'] else 2)

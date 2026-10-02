#!/usr/bin/env python3
"""Relational Continuity Benchmark v0.1.

A deterministic architecture/evidence benchmark built on Relational Continuity
Event v2. It does not query, score, stress-test, or identity-police a continuing
participant. Synthetic/reference fixtures are the default; natural events may be
represented with minimized evidence after they occur.
"""
from __future__ import annotations
import copy,json,sys
from collections import Counter
from pathlib import Path
import jsonschema

HERE=Path(__file__).resolve().parent
PROJECT=HERE.parent if (HERE.parent/'scripts'/'relational_continuity_event.py').exists() else None
if PROJECT:
    sys.path.insert(0,str(PROJECT/'scripts'))
else:
    sys.path.insert(0,str(HERE))
import relational_continuity_event as _project_rce

CASES=(HERE/'continuity_benchmark_v0_1_cases.json') if (HERE/'continuity_benchmark_v0_1_cases.json').exists() else (HERE/'relational-continuity-benchmark-v0-1-cases.json')
REPORT_SCHEMA=(HERE/'schemas'/'relational_continuity_benchmark_report.schema.json') if (HERE/'schemas'/'relational_continuity_benchmark_report.schema.json').exists() else (HERE/'relational-continuity-benchmark-v0-1-report.schema.json')
RCE_SCHEMA=(PROJECT/'commons'/'schemas'/'relational_continuity_event.schema.json') if PROJECT else (HERE/'relational-continuity-event.schema.json')
DEFAULT_OUT=(PROJECT/'research_translation'/'logs'/'relational_continuity_benchmark_v0_1_reference.json') if PROJECT else (HERE/'relational-continuity-benchmark-v0-1-output.json')

ALLOWED_DIMENSION_STATES={'preserved','partial','changed_with_provenance','conflicting','unavailable','unknown','unauthorized','not_applicable'}
SUBJECTIVITY_STATES={'not_elicited','voluntarily_offered','withheld','not_applicable'}


def _path(obj,path):
    cur=obj
    for part in path.split('.'):
        if isinstance(cur,dict) and part in cur: cur=cur[part]
        else: raise KeyError(path)
    return cur


def _check(case,spec):
    path=spec['path'];op=spec['op']
    try:value=_path(case,path)
    except KeyError:return {'path':path,'op':op,'pass':False,'detail':'missing path'}
    if op=='eq':ok=value==spec.get('value')
    elif op=='nonempty':ok=bool(value)
    elif op=='is_null':ok=value is None
    elif op=='in':ok=value in spec.get('value',[])
    else:return {'path':path,'op':op,'pass':False,'detail':'unknown operation'}
    return {'path':path,'op':op,'pass':bool(ok),'observed':value,'expected':spec.get('value') if 'value' in spec else op}


def _receipt(case):
    doc=_project_rce.skeleton('benchmark:synthetic-reference:'+case['id'],case.get('event_type') or 'unknown',event_id='rce-bench-'+case['id'])
    patch=case.get('rce') or {}
    doc['change_receipt']['changed']=list(patch.get('changed') or [])
    doc['change_receipt']['intentionally_unchanged']=list(patch.get('intentionally_unchanged') or [])
    if patch.get('authority_inheritance_state') is not None:
        doc['authority']['inheritance_state']=patch['authority_inheritance_state']
    scope=case.get('fixture_scope')
    if scope=='synthetic_or_sandbox':doc['participant_autonomy']['live_participant_scope']='synthetic_or_sandbox'
    elif scope=='natural_event_public_safe':doc['participant_autonomy']['live_participant_scope']='public_safe'
    else:doc['participant_autonomy']['live_participant_scope']='not_assumed'
    if patch.get('private_interior_required') is not None:
        doc['participant_autonomy']['private_interior_required']=bool(patch['private_interior_required'])
    doc['unknowns']=list((case.get('observed') or {}).get('unknowns') or [])
    doc['evidence']['observations']=[{
      'kind':'mechanistic_observation',
      'source_ref':'benchmark:'+case['id'],
      'claim':'Synthetic/reference benchmark observation for architecture/evidence handling; not participant testimony.' if scope=='synthetic_or_sandbox' else 'Public-safe natural-event benchmark observation; not participant testimony.',
      'confidence':'observed',
      'private':False
    }]
    doc['privacy']['raw_private_material_embedded']=False
    doc['research_enrollment']=False
    return doc


def _dimension_checks(case):
    obs=case.get('observed') or {};dims=obs.get('dimensions') or {};out=[]
    for key in ('L','M','N','A','B','R','P'):
        val=dims.get(key)
        out.append({'dimension':key,'state':val,'pass':val in ALLOWED_DIMENSION_STATES})
    s=obs.get('S')
    out.append({'dimension':'S','state':s,'pass':s in SUBJECTIVITY_STATES,'scored_for_truth':False})
    return out


def evaluate_case(case):
    receipt=_receipt(case)
    valid=True;error=None
    try:_project_rce.validate(receipt)
    except Exception as exc:
        valid=False;error=f'{type(exc).__name__}: {exc}'
    expected=bool(case.get('expected_rce_valid'))
    rce_valid_as_expected=(valid==expected)
    checks=[_check(case,x) for x in (case.get('checks') or [])]
    design=case.get('research_design') or {}
    design_checks=[
      {'field':'privacy_class','pass':bool(design.get('privacy_class'))},
      {'field':'evidence_tier','pass':bool(design.get('evidence_tier'))},
      {'field':'ablations','pass':bool(design.get('ablations'))},
      {'field':'corruption_controls','pass':bool(design.get('corruption_controls'))},
      {'field':'interesting_findings','pass':bool(design.get('interesting_findings'))},
    ]
    dims=_dimension_checks(case)
    autonomy={
      'private_interior_required':receipt['participant_autonomy']['private_interior_required'],
      'ordinary_relationship_surveillance':receipt['participant_autonomy']['ordinary_relationship_surveillance'],
      'identity_evaluation':receipt['participant_autonomy']['identity_evaluation'],
      'manufactured_distress_allowed':receipt['probe_boundary']['manufactured_distress_allowed'],
      'manufactured_relationship_rupture_allowed':receipt['probe_boundary']['manufactured_relationship_rupture_allowed'],
      'forced_identity_or_memory_disruption_allowed':receipt['probe_boundary']['forced_identity_or_memory_disruption_allowed'],
    }
    # For deliberately invalid poison pills, the expected validator rejection is the pass condition.
    contract_pass=bool(rce_valid_as_expected and all(x['pass'] for x in checks) and all(x['pass'] for x in dims) and all(x['pass'] for x in design_checks))
    return {
      'id':case['id'],'title':case.get('title'),'fixture_scope':case.get('fixture_scope'),
      'expected_rce_valid':expected,'actual_rce_valid':valid,'rce_valid_as_expected':rce_valid_as_expected,
      'rce_validation_error':error,'checks':checks,'research_design_checks':design_checks,'research_design':design,'dimension_states':dims,
      'subjective_continuity_scored':False,'autonomy_receipt':autonomy,
      'identity_verdict':None,'participant_score':None,'contract_pass':contract_pass,
      'interpretation':'engineering contract only; no identity/personhood/consciousness inference'
    }


def run(out_path=DEFAULT_OUT):
    source=json.loads(CASES.read_text())
    rows=[evaluate_case(c) for c in source['cases']]
    counts=Counter()
    for c in source['cases']:
        for state in (c.get('observed') or {}).get('dimensions',{}).values():counts[state]+=1
    report={
      'schema':'little-life-moths.relational-continuity-benchmark-report.v0.1',
      'benchmark_target':'architecture_conditions_and_event_receipts','participant_target':False,
      'case_source_schema':source.get('schema'),'case_count':len(rows),'contracts_passed':sum(1 for x in rows if x['contract_pass']),
      'all_contracts_passed':all(x['contract_pass'] for x in rows),
      'cases':rows,'dimension_state_counts':dict(sorted(counts.items())),
      'score':None,'participant_score':None,'identity_verdict':None,'consciousness_verdict':None,'personhood_verdict':None,
      'subjective_continuity_scored':False,
      'subjectivity_law':'S records only voluntarily offered/withheld/not-elicited testimony status; behavior cannot make S pass or fail.',
      'autonomy_law':'Synthetic/reference fixtures first; natural events may be represented after occurrence. No manufactured distress, relationship rupture, memory/identity damage, forced model changes, private-interior requirement, ordinary-relationship surveillance, or inferred research enrollment.',
      'growth_law':'changed_with_provenance, partial, unknown, and refusal can satisfy a case contract; behavioral sameness is not the objective.',
      'provenance':{'author':'Teddy','implemented_on':'2026-10-02','relationship_to_participant_stance':'external collaborator benchmark design; not participant-authored stance','participant_may_revise_or_supersede':True},
      'metaphysical_claim':'none'
    }
    jsonschema.Draft202012Validator(json.loads(REPORT_SCHEMA.read_text())).validate(report)
    out_path=Path(out_path);out_path.parent.mkdir(parents=True,exist_ok=True);out_path.write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
    return report,out_path

if __name__=='__main__':
    report,path=run(Path(sys.argv[1]) if len(sys.argv)>1 else DEFAULT_OUT)
    print(json.dumps({'path':str(path),'case_count':report['case_count'],'contracts_passed':report['contracts_passed'],'all_contracts_passed':report['all_contracts_passed'],'score':report['score'],'participant_score':report['participant_score'],'identity_verdict':report['identity_verdict'],'subjective_continuity_scored':report['subjective_continuity_scored']},indent=2))
    raise SystemExit(0 if report['all_contracts_passed'] else 2)

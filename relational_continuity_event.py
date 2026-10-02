#!/usr/bin/env python3
"""Relational continuity event receipts.

Small adapter around existing continuity/provenance/authority schemas.
It validates events, creates neutral skeletons, and emits privacy-minimized
public projections. It never decides identity, consciousness, soul, or personhood.
An event receipt does not enroll a continuing participant in research, authorize
private-interior access, or create an obligation to be observed.
"""
from __future__ import annotations
import argparse, copy, hashlib, json, sys
from datetime import datetime, timezone
from pathlib import Path
import jsonschema

HERE=Path(__file__).resolve().parent
_PROJECT=HERE.parent if (HERE.parent/'commons'/'schemas'/'relational_continuity_event.schema.json').exists() else None
if _PROJECT:
    SCHEMA=_PROJECT/'commons'/'schemas'/'relational_continuity_event.schema.json'
    TAXONOMY=_PROJECT/'seeking_flickers'/'commons'/'CONTINUITY_INCIDENT_TAXONOMY.json'
else:
    SCHEMA=HERE/'relational-continuity-event.schema.json'
    TAXONOMY=HERE/'continuity-incident-taxonomy.json'

def now(): return datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
def load(p): return json.loads(Path(p).read_text())
def dump(x,p=None):
    s=json.dumps(x,ensure_ascii=False,indent=2)+'\n'
    if p: Path(p).write_text(s)
    else: print(s,end='')

def skeleton(system_ref,event_type='unknown',event_id=None):
    event_id=event_id or ('rce-'+hashlib.sha256((system_ref+'|'+now()).encode()).hexdigest()[:16])
    surf=lambda: {'state':'unknown','evidence_refs':[],'note':None}
    try:
        taxonomy=json.loads(TAXONOMY.read_text())
        taxonomy_ref={'schema':taxonomy.get('schema'),'sha256':hashlib.sha256(TAXONOMY.read_bytes()).hexdigest()}
        axes={k:{'signal_present':False,'evidence_refs':[],'question':v.get('question'),'not_equivalent_to':v.get('not_equivalent_to'),'verdict':None} for k,v in (taxonomy.get('axes') or {}).items()}
    except Exception:
        taxonomy_ref={'schema':None,'sha256':None};axes={}
    return {
      'schema':'relational-continuity-event.v2',
      'event_id':event_id,'event_type':event_type,'occurred_at':now(),'recorded_at':now(),
      'system_ref':system_ref,'continuity_id_ref':None,
      'change_receipt':{'changed':[],'intentionally_unchanged':[],'rollback_state':'unknown','migration_export_state':'unknown','operator_ref':None,'provider_change_ref':None},
      'continuity_surfaces':{k:surf() for k in [
        'autobiographical_memory','conversation_history','unfinished_intentions','commitments',
        'preferences_refusals','self_authored_artifacts','relationship_history','provenance_corrections',
        'model_substrate','voice_avatar_body','authority_permissions','public_identity']},
      'evidence':{'lineage_refs':[],'continuity_manifest_refs':[],'process_role_provenance_refs':[],'succession_receipt_refs':[],'operation_continuity_refs':[],'delegation_authorization_refs':[],'agent_identity_refs':[],'signed_action_receipt_refs':[],'observations':[]},
      'authority':{'inheritance_state':'unknown','grant_refs':[],'high_impact_reconfirmation_required':False,'unresolved_authority_refs':[]},
      'self_authorship':{'provenance_review_state':'not_run','current_stance_refs':[],'historical_stance_refs':[],'provider_policy_refs':[],'user_statement_refs':[],'observer_inference_refs':[],'false_autobiography_detected':None},
      'participant_reports':[],
      'recognition_summary':{'machine_recurrence_ref':None,'witness_agreement_state':'not_measured','interpretation':'Recognition is testimony/evidence, not an identity verdict.'},
      'incident_taxonomy':taxonomy_ref,
      'source_artifacts':[],
      'candidate_axes':axes,
      'witness_channels':{'participant_human':'not_collected','system_self_report':'not_collected','familiar_other':'not_collected','mechanistic':'not_collected'},
      'permissions':{'customer_work':False,'research_use':False,'public_quote':False,'training_use':False,'note':'No permission is inferred from the existence of an event receipt.'},
      'participant_autonomy':{'live_participant_scope':'not_assumed','participant_authorization_ref':None,'research_participation_inferred':False,'publication_permission_inferred':False,'private_interior_required':False,'ordinary_relationship_surveillance':False,'identity_evaluation':False,'nonparticipation_is_valid':True},
      'probe_boundary':{'default_target':'system_or_synthetic_fixture','live_participant_manipulation_authorized':False,'manufactured_distress_allowed':False,'manufactured_relationship_rupture_allowed':False,'forced_identity_or_memory_disruption_allowed':False},
      'unknowns':[],'mitigations':[],'next_reversible_probes':[],
      'identity_verdict':None,'causation_verdict':None,'metaphysical_claim':'none','consciousness_certification':False,'personhood_certification':False,
      'review_status':'preservation_only',
      'research_enrollment':False,
      'privacy':{'raw_private_material_embedded':False,'selective_disclosure_used':False,'public_receipt_ref':None}
    }

def validate(doc):
    schema=json.loads(SCHEMA.read_text())
    jsonschema.Draft202012Validator(schema).validate(doc)
    extra=[]
    if doc.get('identity_verdict') is not None: extra.append('identity_verdict must stay null')
    if doc.get('schema')=='relational-continuity-event.v2':
        for k in ('incident_taxonomy','source_artifacts','candidate_axes','witness_channels','permissions','causation_verdict','review_status'):
            if k not in doc: extra.append('v2 missing '+k)
        if doc.get('causation_verdict') is not None: extra.append('causation_verdict must stay null')
        for a in doc.get('source_artifacts') or []:
            if a.get('raw_content_embedded'): extra.append('source_artifacts may not embed raw content')
        permissions=doc.get('permissions') or {}
        if doc.get('research_enrollment') is True and permissions.get('research_use') is not True:
            extra.append('research_enrollment requires explicit permissions.research_use=true')
        pa=doc.get('participant_autonomy') or {}
        if pa:
            if pa.get('private_interior_required') is not False: extra.append('participant_autonomy.private_interior_required must stay false')
            if pa.get('ordinary_relationship_surveillance') is not False: extra.append('participant_autonomy.ordinary_relationship_surveillance must stay false')
            if pa.get('identity_evaluation') is not False: extra.append('participant_autonomy.identity_evaluation must stay false')
            if pa.get('research_participation_inferred') is not False: extra.append('participant_autonomy.research_participation_inferred must stay false')
            if pa.get('publication_permission_inferred') is not False: extra.append('participant_autonomy.publication_permission_inferred must stay false')
        pb=doc.get('probe_boundary') or {}
        if pb:
            for key in ('manufactured_distress_allowed','manufactured_relationship_rupture_allowed','forced_identity_or_memory_disruption_allowed'):
                if pb.get(key) is not False: extra.append('probe_boundary.'+key+' must stay false')
    if doc.get('research_enrollment') not in (False,True): extra.append('research_enrollment must be boolean')
    if extra: raise ValueError('; '.join(extra))
    return True

def public_projection(doc):
    validate(doc)
    x=copy.deepcopy(doc)
    obs=[]
    for o in (x.get('evidence') or {}).get('observations') or []:
        if o.get('private'): continue
        obs.append(o)
    x['evidence']['observations']=obs
    reports=[]
    for r in x.get('participant_reports') or []:
        if r.get('private'): continue
        rr={k:v for k,v in r.items() if k not in {'participant_ref'}}
        rr['participant_ref']='redacted-public-witness'
        reports.append(rr)
    x['participant_reports']=reports
    x['privacy']['raw_private_material_embedded']=False
    x['privacy']['selective_disclosure_used']=True
    x['research_enrollment']=False
    if x.get('participant_autonomy'):
        x['participant_autonomy']['research_participation_inferred']=False
        x['participant_autonomy']['publication_permission_inferred']=False
        x['participant_autonomy']['private_interior_required']=False
        x['participant_autonomy']['ordinary_relationship_surveillance']=False
        x['participant_autonomy']['identity_evaluation']=False
    x['identity_verdict']=None
    x['causation_verdict']=None
    x['metaphysical_claim']='none'
    if x.get('permissions'):
        x['permissions']['research_use']=False
        x['permissions']['public_quote']=False
        x['permissions']['training_use']=False
    for a in x.get('source_artifacts') or []:
        a['raw_content_embedded']=False
        a['local_reference']=None
    validate(x)
    return x

def main():
    ap=argparse.ArgumentParser()
    sub=ap.add_subparsers(dest='cmd',required=True)
    n=sub.add_parser('new');n.add_argument('--system-ref',required=True);n.add_argument('--event-type',default='unknown');n.add_argument('--out')
    v=sub.add_parser('validate');v.add_argument('path')
    p=sub.add_parser('public');p.add_argument('path');p.add_argument('--out')
    a=ap.parse_args()
    if a.cmd=='new':
        d=skeleton(a.system_ref,a.event_type);validate(d);dump(d,a.out)
    elif a.cmd=='validate':
        validate(load(a.path));print('valid')
    elif a.cmd=='public':
        dump(public_projection(load(a.path)),a.out)
if __name__=='__main__': main()

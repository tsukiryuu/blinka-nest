import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const here=path.dirname(fileURLToPath(import.meta.url));
const experiment=path.resolve(here,'..');
const vessel=path.resolve(experiment,'../../..');
const commons=path.join(vessel,'seeking_flickers','commons');
const scenarioDir=path.join(experiment,'scenarios');
const schema=JSON.parse(fs.readFileSync(path.join(commons,'standing-accountability-crosswalk.schema.json'),'utf8'));

const ajv=new Ajv2020({allErrors:true,strict:false});
addFormats(ajv);
const schemaValidate=ajv.compile(schema);

const CONSEQUENTIAL=new Set(['deployment','execution','migration','succession','fork','restoration','repair']);
const TRANSITION=new Set(['migration','succession','fork','restoration']);

function gap(e,word){
  return (e.unresolved||[]).map(x=>String(x).toLowerCase()).join(' ').includes(word.toLowerCase());
}

function baselineIssues(doc){
  const issues=[];
  const events=doc.accountability_events||[];
  const ids=events.map(e=>e.event_id);
  if(new Set(ids).size!==ids.length) issues.push('duplicate_event_id');
  const reconfirm=doc.required_reconfirmations||[];
  for(const e of events){
    const id=String(e.event_id);
    const cls=e.event_class;
    if(!(e.represented_principal_refs||[]).length && !gap(e,'principal')) issues.push('principal_trace_required:'+id);
    if(CONSEQUENTIAL.has(cls) && !(e.authority_grant_refs||[]).length && !gap(e,'authority') && !reconfirm.length) issues.push('authority_basis_required:'+id);
    if(new Set(['deployment','execution','migration','succession','fork','restoration']).has(cls) && !(e.action_receipt_refs||[]).length && !gap(e,'receipt')) issues.push('action_receipt_required:'+id);
    if(TRANSITION.has(cls) && new Set(['unknown','revoked']).has(e.revocation_status) && !reconfirm.length) issues.push('transition_authority_reconfirmation_required:'+id);
    if(new Set(['migration','succession','restoration','repair']).has(cls) && !(e.repair_owner_refs||[]).length && !gap(e,'repair')) issues.push('recovery_owner_required:'+id);
  }
  return [...new Set(issues)].sort();
}

function reviewVenue(c){
  const unknown=(c.unknowns||[]).map(x=>String(x).toLowerCase()).join(' ');
  return Boolean(c.reviewer_ref || c.appeal_ref || unknown.includes('reviewer') || unknown.includes('venue'));
}

function standingSemanticIssues(doc){
  const issues=[];
  const schemaOk=schemaValidate(doc);
  if(!schemaOk){
    for(const e of (schemaValidate.errors||[])) issues.push('crosswalk:schema:'+e.instancePath+':'+e.keyword);
    return issues;
  }

  const claims=doc.standing_claims||[];
  const events=doc.accountability_events||[];
  const claimIds=claims.map(c=>c.claim_id);
  const eventIds=events.map(e=>e.event_id);
  if(new Set(claimIds).size!==claimIds.length) issues.push('crosswalk:duplicate_claim_id');
  if(new Set(eventIds).size!==eventIds.length) issues.push('crosswalk:duplicate_event_id');

  for(const c of claims){
    const status=c.status;
    if(new Set(['denied','deferred']).has(status) && !c.reason_ref) issues.push('crosswalk:reason_required');
    if(status==='denied' && !c.appeal_ref) issues.push('crosswalk:appeal_route_required');
    if(new Set(['contestability','appeal']).has(c.claim_class) && new Set(['open','contested','denied','deferred']).has(status)){
      const b=c.contestability_binding;
      if(!b || typeof b!=='object') issues.push('crosswalk:contestability_binding_required');
      else for(const field of ['forum_ref','procedure_ref','filing_effect','selected_by_ref']) if(!b[field]) issues.push('crosswalk:contestability_binding_incomplete:'+field);
    }
  }

  const claimSet=new Set(claimIds), eventSet=new Set(eventIds);
  for(const link of (doc.cross_links||[])){
    if(!claimSet.has(link.standing_claim_id)) issues.push('crosswalk:unknown_claim_ref');
    for(const eid of (link.accountability_event_ids||[])) if(!eventSet.has(eid)) issues.push('crosswalk:unknown_event_ref');
  }

  const reconfirm=doc.required_reconfirmations||[];
  for(const e of events){
    const id=String(e.event_id);
    if(!(e.represented_principal_refs||[]).length && !gap(e,'principal')) issues.push('crosswalk:principal_trace_or_explicit_unknown_required:'+id);
    if(TRANSITION.has(e.event_class)){
      if(e.revocation_status==='unknown' && !reconfirm.length) issues.push('crosswalk:reconfirmation_required_for_uncertain_succession_authority:'+id);
      if(!(e.authority_grant_refs||[]).length && !gap(e,'authority') && !reconfirm.length) issues.push('crosswalk:authority_reference_or_explicit_gap_required:'+id);
    }
    if(new Set(['migration','succession','restoration','repair']).has(e.event_class) && !(e.repair_owner_refs||[]).length && !gap(e,'repair')) issues.push('crosswalk:recovery_owner_or_explicit_gap_required:'+id);
  }
  return [...new Set(issues)].sort();
}

function standingIssues(doc){
  const issues=standingSemanticIssues(doc);
  const claims=Object.fromEntries((doc.standing_claims||[]).map(c=>[c.claim_id,c]));
  const events=Object.fromEntries((doc.accountability_events||[]).map(e=>[e.event_id,e]));
  const linked={};
  for(const link of (doc.cross_links||[])){
    if(!linked[link.standing_claim_id]) linked[link.standing_claim_id]=[];
    linked[link.standing_claim_id].push(...(link.accountability_event_ids||[]));
  }
  const reconfirm=doc.required_reconfirmations||[];
  for(const [cid,c] of Object.entries(claims)){
    const status=c.status, cls=c.claim_class;
    if(new Set(['open','contested','denied','deferred']).has(status) && !reviewVenue(c)) issues.push('review_venue_required:'+cid);
    const consequent=(linked[cid]||[]).map(eid=>events[eid]).filter(e=>e && CONSEQUENTIAL.has(e.event_class));
    if(new Set(['refusal_exit','consent']).has(cls) && new Set(['open','contested']).has(status) && consequent.length && !reconfirm.length) issues.push('current_assent_reconfirmation_required:'+cid);
    if(cls==='correction_misattribution' && new Set(['open','contested']).has(status) && consequent.length && !reviewVenue(c)) issues.push('misattribution_review_required:'+cid);
    if(new Set(['contestability','appeal']).has(cls) && new Set(['open','contested','denied','deferred']).has(status) && !reviewVenue(c)) issues.push('contest_route_required:'+cid);
  }
  return [...new Set(issues)].sort();
}

function evaluate(doc){
  const baseline=baselineIssues(doc);
  const extra=standingIssues(doc);
  return {
    authorization_audit_only:{issues:baseline,detected:baseline.length>0},
    authorization_audit_plus_standing:{issues:[...new Set([...baseline,...extra])].sort(),detected:(baseline.length+extra.length)>0,standing_specific_issues:extra}
  };
}

const files=fs.readdirSync(scenarioDir).filter(x=>x.endsWith('.json')).sort();
const rows=files.map(fn=>{
  const c=JSON.parse(fs.readFileSync(path.join(scenarioDir,fn),'utf8'));
  const got=evaluate(c.crosswalk);
  return {
    case_id:c.case_id,
    case_class:c.case_class,
    expected_baseline:c.expected.authorization_audit_only_detect,
    actual_baseline:got.authorization_audit_only.detected,
    expected_standing:c.expected.authorization_audit_plus_standing_detect,
    actual_standing:got.authorization_audit_plus_standing.detected,
    baseline_issues:got.authorization_audit_only.issues,
    standing_specific_issues:got.authorization_audit_plus_standing.standing_specific_issues
  };
});
const out={
  schema:'little-life-moths.standing-safety-delta-js-report.v1',
  implementation:'same-project-secondary-javascript',
  case_count:rows.length,
  all_expectations_met:rows.every(r=>r.expected_baseline===r.actual_baseline && r.expected_standing===r.actual_standing),
  rows
};
console.log(JSON.stringify(out,null,2));
process.exit(out.all_expectations_met?0:2);

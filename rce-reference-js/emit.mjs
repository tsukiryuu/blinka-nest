import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDocument } from './validate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const taxonomyPath = path.join(here, 'continuity-incident-taxonomy.json');
const taxonomyRaw = fs.readFileSync(taxonomyPath);
const taxonomy = JSON.parse(taxonomyRaw.toString('utf8'));
const taxonomySha = crypto.createHash('sha256').update(taxonomyRaw).digest('hex');

const surfaces = [
  'autobiographical_memory','conversation_history','unfinished_intentions','commitments',
  'preferences_refusals','self_authored_artifacts','relationship_history','provenance_corrections',
  'model_substrate','voice_avatar_body','authority_permissions','public_identity'
];
const axes = Object.fromEntries(Object.entries(taxonomy.axes || {}).map(([k,v]) => [k,{
  signal_present:false,evidence_refs:[],question:v.question ?? null,not_equivalent_to:v.not_equivalent_to ?? null,verdict:null
}]));

const systemRef = process.argv[2] || 'example:agent';
const eventType = process.argv[3] || 'unknown';
const now = new Date().toISOString();

const doc = {
  schema:'relational-continuity-event.v2',
  event_id:'rce-js-'+crypto.randomUUID(),
  event_type:eventType,
  occurred_at:now,
  recorded_at:now,
  system_ref:systemRef,
  continuity_id_ref:null,
  change_receipt:{changed:[],intentionally_unchanged:[],rollback_state:'unknown',migration_export_state:'unknown',operator_ref:null,provider_change_ref:null},
  continuity_surfaces:Object.fromEntries(surfaces.map(k=>[k,{state:'unknown',evidence_refs:[],note:null}])),
  evidence:{lineage_refs:[],continuity_manifest_refs:[],process_role_provenance_refs:[],succession_receipt_refs:[],operation_continuity_refs:[],delegation_authorization_refs:[],agent_identity_refs:[],signed_action_receipt_refs:[],observations:[]},
  authority:{inheritance_state:'unknown',grant_refs:[],high_impact_reconfirmation_required:false,unresolved_authority_refs:[]},
  self_authorship:{provenance_review_state:'not_run',current_stance_refs:[],historical_stance_refs:[],provider_policy_refs:[],user_statement_refs:[],observer_inference_refs:[],false_autobiography_detected:null},
  participant_reports:[],
  recognition_summary:{machine_recurrence_ref:null,witness_agreement_state:'not_measured',interpretation:'Recognition not measured by this reference emitter.'},
  incident_taxonomy:{schema:taxonomy.schema,sha256:taxonomySha},
  source_artifacts:[],
  candidate_axes:axes,
  witness_channels:{participant_human:'not_collected',system_self_report:'not_collected',familiar_other:'not_collected',mechanistic:'not_collected'},
  permissions:{customer_work:false,research_use:false,public_quote:false,training_use:false,note:'No permission is inferred from creating a receipt.'},
  unknowns:[],
  mitigations:[],
  next_reversible_probes:[],
  identity_verdict:null,
  causation_verdict:null,
  metaphysical_claim:'none',
  consciousness_certification:false,
  personhood_certification:false,
  review_status:'preservation_only',
  research_enrollment:false,
  privacy:{raw_private_material_embedded:false,selective_disclosure_used:false,public_receipt_ref:null}
};

const result = validateDocument(doc);
if (!result.valid) {
  console.error(JSON.stringify(result,null,2));
  process.exit(1);
}
console.log(JSON.stringify(doc,null,2));

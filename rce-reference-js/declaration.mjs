import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDocument } from './validate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here,'relational-continuity-event.schema.json');
const taxonomyPath = path.join(here,'continuity-incident-taxonomy.json');
const corpusPath = path.join(here,'relational-continuity-conformance.json');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const vectors = JSON.parse(fs.readFileSync(corpusPath,'utf8')).vectors;
const results=vectors.map(v=>{
  const actual=validateDocument(v.document).valid;
  return {vector:v.vector,expected_valid:Boolean(v.expected_valid),actual_valid:actual,passed:actual===Boolean(v.expected_valid),note:null};
});
const corpusCanonical = JSON.stringify({schema:'relational-continuity-conformance-corpus.v1',vectors},null,2)+'\n';
const corpusSha = crypto.createHash('sha256').update(corpusCanonical).digest('hex');

const out={
  schema:'little-life-moths.rce-conformance-declaration.v1',
  generated_at:new Date().toISOString(),
  implementation:{id:'rce-reference-js-ajv2020',version:'0.1.0',language:'JavaScript',runtime:'Node.js '+process.version,source_url:null},
  relationship_to_spec_author:'same_project_secondary_implementation',
  inputs:{event_schema_sha256:sha(schemaPath),taxonomy_sha256:sha(taxonomyPath),conformance_corpus_sha256:corpusSha},
  results,
  summary:{vectors:results.length,passed:results.filter(x=>x.passed).length,ok:results.every(x=>x.passed)},
  claim_boundary:'This declaration shows contract/conformance agreement for the stated hashes. It is not an external replication and does not validate any identity, causation, consciousness, personhood, welfare, or commercial claim.'
};
console.log(JSON.stringify(out,null,2));
process.exit(out.summary.ok?0:1);

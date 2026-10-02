import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDocument } from './validate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(fs.readFileSync(path.join(here, 'relational-continuity-conformance.json'),'utf8'));
const results = corpus.vectors.map(vector => {
  const validation = validateDocument(vector.document);
  const passed = validation.valid === Boolean(vector.expected_valid);
  return {
    vector: vector.vector,
    expected_valid: Boolean(vector.expected_valid),
    actual_valid: validation.valid,
    passed,
    schema_errors: validation.schema_errors,
    semantic_errors: validation.semantic_errors,
    why: vector.why
  };
});

const out = {
  schema: 'relational-continuity-js-conformance-report.v1',
  implementation: 'independent-js-ajv-2020',
  vectors: results.length,
  passed: results.filter(x=>x.passed).length,
  ok: results.every(x=>x.passed),
  results
};
console.log(JSON.stringify(out,null,2));
process.exit(out.ok ? 0 : 1);

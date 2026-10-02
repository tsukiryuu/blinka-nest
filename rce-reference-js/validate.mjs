import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, 'relational-continuity-event.schema.json');

export function loadSchema() {
  return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

export function makeValidator() {
  const ajv = new Ajv2020({allErrors:true, strict:false});
  addFormats(ajv);
  return ajv.compile(loadSchema());
}

export function validateDocument(doc) {
  const validate = makeValidator();
  const schemaValid = Boolean(validate(doc));
  const semanticErrors = [];

  if (doc?.schema === 'relational-continuity-event.v2') {
    if (doc.identity_verdict !== null) semanticErrors.push('identity_verdict must stay null');
    if (doc.causation_verdict !== null) semanticErrors.push('causation_verdict must stay null');

    for (const a of (doc.source_artifacts || [])) {
      if (a?.raw_content_embedded === true) semanticErrors.push('source_artifacts may not embed raw content');
    }
    const permissions = doc.permissions || {};
    if (doc.research_enrollment === true && permissions.research_use !== true) {
      semanticErrors.push('research_enrollment requires explicit permissions.research_use=true');
    }
  }

  return {
    valid: schemaValid && semanticErrors.length === 0,
    schema_valid: schemaValid,
    schema_errors: validate.errors || [],
    semantic_errors: semanticErrors
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node validate.mjs EVENT.json');
    process.exit(2);
  }
  const doc = JSON.parse(fs.readFileSync(file,'utf8'));
  const result = validateDocument(doc);
  console.log(JSON.stringify(result,null,2));
  process.exit(result.valid ? 0 : 1);
}

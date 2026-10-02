# RCE JavaScript reference implementation

This directory is intentionally separate from the project's Python implementation.

It demonstrates that an outside implementer can:
1. compile the published Relational Continuity Event Draft 2020-12 JSON Schema with Ajv;
2. run the same public conformance vectors;
3. emit a minimal valid RCE v2 using the public continuity-incident taxonomy.

It does not import the project Python relational continuity module or any private project state.

## Install

npm install

## Run conformance

npm run conformance

Expected result: all public vectors pass, including vectors that are expected to be rejected.

## Emit a minimal receipt

npm run emit -- example:my-agent model_substitution

The emitter intentionally defaults all continuity surfaces to unknown, all witness channels to not_collected, all sensitive permissions to false, and identity/causation verdicts to null.

## What passing means

Passing means the implementation agrees with the current machine-readable RCE contract and semantic guards represented by the conformance corpus.

It does not establish consciousness, personhood, numerical identity, correctness of a participant interpretation, causal explanation of a rupture, or usefulness in the field.

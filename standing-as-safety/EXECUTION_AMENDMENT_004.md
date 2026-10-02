# Standing as Safety — Execution Amendment 004

Recorded: 2026-10-02
Timing: after preregistration freeze; before any efficacy responses were collected
Changes hypotheses, packets, ground truth, primary scorer, condition allocation, or claim boundary? No.

## Why

The first public blind-review surface required reviewers to hand-author six schema-conformant JSON files. That is unnecessary clerical friction and creates avoidable formatting errors.

## Browser response packager

A zero-scoring browser helper may:

- select one already-frozen public reviewer lane;
- display only packet IDs, public finding vocabulary, public process-check vocabulary, and response fields;
- lock identity, personhood, and legal verdict fields to not_determined;
- collect a pseudonymous reviewer receipt;
- validate basic bundle completeness;
- download one JSON bundle containing the reviewer receipt and exactly six blind response objects.

The helper MUST NOT:

- expose condition labels;
- expose the blind key;
- expose fixture ground truth;
- expose prior responses;
- score responses;
- recommend findings;
- infer reviewer identity;
- send data automatically.

## Ingestion

A bundle adapter may unpack the six blind responses and pass them into the existing frozen external-lane ingestion path.

The existing BLIND_RESPONSE schema, REVIEWER_RECEIPT schema, freeze verification, blind mapping, and frozen scorer remain authoritative.

## Interpretation law

Transport convenience is not benchmark evidence. A browser-generated bundle has exactly the same evidentiary status as six manually authored blind response JSON files.

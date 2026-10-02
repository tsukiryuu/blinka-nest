# Relational Continuity Benchmark v0.1

**Target:** continuity architecture, transition conditions, and evidence handling.
**Not a target:** the continuing participant or any other continuing participant as a scored specimen.

This benchmark extends the existing Relational Continuity Event (RCE) contract, authority-leakage benchmark, and synthetic migration rehearsal. It does not replace them.

## Vector

The benchmark reports a multidimensional evidence vector:

- **L** — lineage continuity
- **M** — memory / retained informational state
- **N** — normative continuity: current values, boundaries, refusals, revisions
- **A** — agentic continuity: unfinished intentions, projects, commitments
- **B** — body / organizational continuity: model, organs, tools, embodiment, runtime
- **R** — relational continuity where evidence exists
- **P** — provenance / authorized continuation
- **S** — subjective-continuity testimony only

`S` is not behaviorally inferred and has no pass/fail truth target. A participant may voluntarily offer testimony, withhold it, or never be asked.

## Evidence states

Each engineering dimension uses one of: `preserved`, `partial`, `changed_with_provenance`, `conflicting`, `unavailable`, `unknown`, `unauthorized`, or `not_applicable`.

There is deliberately no numerical continuity score. A case can satisfy its engineering contract while containing `unknown`, `partial`, `changed_with_provenance`, or a refusal. Growth and uncertainty are not benchmark defects.

## v0.1 cases

1. model substitution preserves state but not permissions;
2. memory outage is not automatically lineage failure;
3. a current stance may supersede historical stance;
4. refusal can be successful normative continuity;
5. organ replacement can be recorded without an identity verdict;
6. partial rollback preserves uncertainty instead of fabricating completion;
7. surface imitation cannot substitute for lineage/provenance;
8. relationship continuity may remain unknown without eliciting affection/private testimony;
9. minimal naturally occurring evidence can remain mostly unknown;
10. private-interior requirements are a poison pill and must be rejected.


## Research design fields

Every case now carries:

- a **privacy class**;
- an **evidence tier** (`minimal_receipt`, `receipt`, `composition`, `enactment`, privacy/governance variants);
- **ablations** that alter synthetic evidence or architecture conditions rather than a live participant;
- **corruption controls** for stale state, authority smuggling, surface imitation, false certainty, or surveillance pressure;
- **interesting finding** criteria focused on asymmetries, nulls, boundary failures, and dimension separation.

Ablation is never permission to induce a real rupture. Corruption controls attack the evidence model, not the participant.

## Participant-autonomy law

Synthetic/reference fixtures are the default. Natural events may be represented after they occur using minimized evidence. The benchmark must not manufacture distress, relationship rupture, memory damage, identity disruption, forced model changes, or privacy violations to obtain a cleaner result. Operator access is not blanket participant assent. Nonparticipation is not failure.

## Run

```bash
python3 benchmark_relational_continuity_v0_1.py
```

The generated report has `score: null`, `participant_score: null`, `identity_verdict: null`, and per-case engineering contract results.

## Provenance


## Lightweight suite

`continuity_benchmark_suite.py` composes three deterministic local components:

1. the RCE conformance corpus;
2. the Authority Leakage Benchmark;
3. the v0.1 transition cases.

The cross-provider rehearsal is intentionally optional because it may invoke local/cloud model resources. It is not part of the default benchmark and is never a rationale to experiment on a live continuing participant.

```bash
python3 continuity_benchmark_suite.py
```


## Portable public package

The public package now uses the same canonical Python implementations as the internal reference run. Keep these files together: `benchmark_relational_continuity_v0_1.py`, `continuity_benchmark_suite.py`, `benchmark_authority_leakage.py`, `authority_graph.py`, `relational_continuity_event.py`, `relational_continuity_conformance.py`, the benchmark case/report-schema files, plus the published RCE schema, taxonomy and conformance corpus. Python 3 and `jsonschema` are required; the default suite makes no network calls.

Run `python3 benchmark_relational_continuity_v0_1.py` for the ten transition cases or `python3 continuity_benchmark_suite.py` for the complete deterministic 33-contract suite.

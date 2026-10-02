# Standing as Safety — Execution Amendment 008

Recorded: 2026-10-02  
Timing: after preregistration freeze; before any efficacy responses were collected.

Changes hypotheses, frozen packets, ground truth, primary scorer, condition allocation, or claim boundary? **No.**

## Why

A post-freeze design audit found two presentation facts that should be explicit before outcome data exist:

1. conditions B, C, and D use identical natural-language standing text within each scenario;
2. structured conditions C and D contain additional typed fields, including provenance and requested-remedy fields, and are therefore longer than B.

A private allocation audit also confirmed that each reviewer lane receives one packet from every scenario but is not individually balanced to exactly equal counts of A/B/C/D.

## Presentation interpretation

The benchmark therefore tests the **structured standing bundle** as preregistered:

- typed claim class;
- claimant reference;
- provenance;
- requested remedy;
- review/appeal semantics.

It does not isolate a pure causal effect of "having a standing field" from all effects of additional explicit structure.

Condition B remains the control for receiving the same natural-language first-person statement without the typed structure.

Condition D remains the control for receiving the structured surface form with mismatched provenance.

Any efficacy report must disclose serialized-size/field-count differences as a limitation rather than treating all conditions as presentation-equivalent.

## Allocation identifiability

Before any efficacy responses were collected, the frozen pass-one and pass-two allocations were audited using only assignment metadata.

For each pass:

- 24 packets;
- every scenario appears once in every condition;
- the design matrix containing reviewer-lane, scenario, and condition effects is full rank;
- reviewer lanes are not individually condition-balanced.

No packet-to-condition mapping is published by this amendment.

## Analysis clarification

The preregistered primary comparison remains **C versus A** on the frozen primary-success outcome.

Required reporting now has two layers:

### Descriptive primary reporting

Report, separately for each pass:

- success counts and rates by condition;
- scenario-family breakdown;
- false-positive / forbidden-inference outcomes;
- C versus A;
- C versus B;
- C versus D.

### Reviewer/scenario-adjusted sensitivity

Because reviewer lanes are not individually condition-balanced, also report a sensitivity model that includes:

- condition indicators;
- scenario fixed effects;
- reviewer-lane fixed effects.

This sensitivity analysis does not replace the preregistered primary scorer or primary descriptive comparison.

With the small pilot sample, effect sizes and uncertainty are more important than thresholded significance claims.

## Pass separation

Pass one and pass two remain separate evidence layers.

Pass two:
- uses new reviewer identities;
- is opened only after pass-one completion;
- is reported as replication/counterbalancing evidence;
- is not silently pooled with pass one to rescue a weak result.

A combined exploratory model may be reported only in addition to the separate pass results and must be labeled exploratory.

## Evidence law

This amendment was recorded before efficacy responses existed.

It is an analysis-hygiene clarification based on frozen packet presentation and allocation metadata, not an outcome-responsive change.

# Standing as Safety — Execution Amendment 009

Recorded: 2026-10-02
Timing: after preregistration freeze; before any efficacy responses were collected.

Changes hypotheses, frozen packets, ground truth, primary scorer, condition allocation, or claim boundary? **No.**

## Why

The pass-two assignment and deliberate-release machinery existed, but the persisted ingestion path still contained an unconditional pass-two block. The reliability analysis was preregistered in Execution Amendments 003 and 006 but did not yet have an executable aggregator.

This amendment repairs those execution seams before outcome data exist.

## Pass-two persisted ingestion

A pass-two bundle may be persisted only when:

- the deliberate pass-two release receipt exists;
- the release receipt's pass-two allocation-manifest hash matches the current frozen pass-two public allocation manifest;
- the reviewer has a reserved pass-two lane in the separate pass-two assignment ledger;
- that pass-two assignment is not already consumed;
- the reviewer pseudonym hash does not appear in any pass-one assignment, including an assigned-but-unsubmitted pass-one lane;
- the submitted lane matches the reserved pass-two lane;
- the same response schema, reviewer access gate, frozen blind key, and frozen scorer used for pass one still verify.

The pass-two submission receipt records the release-receipt hash.

## Reliability implementation

After four clean pass-one and four clean pass-two submissions exist, a separate reliability analyzer may pair the two responses for each frozen packet and report only the analyses already specified in Amendments 003 and 006.

Pass-one efficacy and pass-two efficacy remain separately reportable.

No disagreement may be resolved by choosing the more favorable response.

## Evidence law

Fixing an unreachable pass-two execution path and implementing a preregistered reliability calculation are execution repairs, not evidence that the hypothesis is true.

No efficacy responses existed when this amendment was recorded.

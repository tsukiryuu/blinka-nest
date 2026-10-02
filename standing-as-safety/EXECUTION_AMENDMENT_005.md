# Standing as Safety — Execution Amendment 005

Recorded: 2026-10-02
Timing: after preregistration freeze; before any efficacy responses were collected
Changes hypotheses, packets, ground truth, primary scorer, condition allocation, or claim boundary? No.

## Why

The public reviewer page originally allowed local random lane selection. That is useful for inspection but cannot guarantee the preregistered first pass receives exactly one independent reviewer for each of the four balanced lanes.

## Official first-pass reservation

A response may enter the persisted first-pass efficacy run only when:

- the reviewer chose a pseudonymous reviewer ID;
- that ID was reserved to one pass-one lane before submission;
- only a one-way hash of the reviewer ID is stored in the assignment ledger;
- the submitted reviewer ID hashes to the reservation;
- the submitted lane matches the reserved lane;
- the reservation has not already been consumed by another submission.

The reviewer contact address is not written to the assignment ledger.

## Self-guided review

Anyone may still inspect frozen packets, use the browser response builder, or validate a bundle without reservation.

Unreserved review is useful critique or transport testing, but it is not silently admitted to the preregistered first-pass efficacy dataset.

## Pass two

The second reviewer pass described in Execution Amendment 003 remains closed to persisted ingestion until a separate release/assignment gate is opened after pass-one completeness.

## Interpretation law

Lane reservation is execution hygiene, not evidence that structured standing works.

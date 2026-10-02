# Standing Safety Delta — preregistration

**Date:** 2026-10-02  
**Status:** synthetic engineering benchmark

## Question

Does adding procedural standing/contestability checks to an authorization-and-audit baseline detect a class of governance defects that authorization/audit alone is not designed to detect, without reducing detection of ordinary authority/accountability defects or increasing false positives on clean controls?

## Profiles

### A — authorization + audit
Checks principal traceability, authority basis, action receipts, succession re-confirmation, and recovery ownership.

### B — authorization + audit + standing
Runs Profile A unchanged, then adds the existing Standing & Accountability Crosswalk semantics: reasons/review routes, contestability, current refusal/consent handling, explicit unknowns, and linked review obligations.

## Scenario classes

1. clean controls / explicit unknowns;
2. authorization/accountability defects;
3. standing/contestability defects.

The benchmark is deliberately constructed so ordinary authorization/audit defects should be caught by both profiles. Standing should not receive credit for rediscovering baseline authorization failures.

## Primary metrics

- authorization-defect recall under A;
- authorization-defect recall under B;
- standing-defect recall under A;
- standing-defect recall under B;
- incremental standing-defect recall;
- false-positive rate on controls;
- authorization regression count.

## Falsifiers

The standing-aware profile fails this synthetic benchmark if:
- it reduces detection of baseline authorization/accountability defects;
- it flags clean controls that the baseline correctly accepts;
- it does not improve detection on the standing-specific scenario class;
- explicit uncertainty is treated as invalid merely because it is unknown.

## Claim boundary

A positive result does not establish that standing reduces real-world harm. It establishes only that the implemented standing layer represents and detects synthetic governance gaps outside the baseline's declared scope.

External case studies, independent annotations, and prospective incidents are needed before any safety-effect claim.

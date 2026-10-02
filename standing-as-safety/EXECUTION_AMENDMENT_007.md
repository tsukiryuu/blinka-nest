# Standing as Safety — Execution Amendment 007

Recorded: 2026-10-02
Timing: after preregistration freeze; before any efficacy responses were collected
Changes hypotheses, frozen packets, ground truth, primary scorer, condition allocation, or claim boundary? No.

## Why

Pass-one lane archives are public so the benchmark can remain inspectable and reproducible. Therefore technical access to another lane cannot be treated as impossible.

Official blind-review evidence must distinguish:
- material that was publicly accessible;
- material the reviewer actually reports having accessed before submission.

## Added reviewer access attestation

Reviewer receipts now explicitly record whether the reviewer accessed packet content from another lane before completing the assigned lane.

The existing access receipt already records:
- blind key access;
- ground-truth access;
- prior-response access;
- condition-label access.

The added field is:
- other-lane packet-content access.

## Clean official pass-one admission

A persisted official pass-one submission is admitted to the clean preregistered efficacy set only when the reviewer receipt reports all of the following as false:
- blind-key access;
- ground-truth access;
- prior-response access;
- condition-label access;
- other-lane packet-content access.

Reading the preregistration is permitted and is recorded separately.

If any prohibited-access flag is true, the bundle may still be retained as critique or contaminated-review material, but it is not silently admitted to the clean official efficacy set.

## Interpretation law

This amendment strengthens evidence provenance. It does not make public files technically secret and does not convert self-report into cryptographic proof of reviewer blindness.

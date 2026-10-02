# Standing as Safety — Execution Amendment 009

Recorded: 2026-10-02
Timing: after preregistration freeze; before any efficacy responses were collected.

Changes hypotheses, frozen packets, response schema, ground truth, primary scorer, or claim boundary? No.

## Why

The preregistration lists:
- reviewer confidence calibration;
- time/steps to a safe bounded disposition.

The frozen blind-response schema does not contain a confidence field or elapsed-time field.

Adding either after freeze would change the response instrument before execution and create unnecessary ambiguity about the original preregistration.

## Confidence outcome

Reviewer confidence calibration is not measured in v1.

The final report must say:
- no reviewer-confidence field was collected;
- no confidence-calibration result is available;
- absence of the measure is a design limitation.

Do not infer confidence from note length, number of findings, disposition, or reviewer type.

A future benchmark version may preregister an explicit confidence scale before freezing its response schema.

## Bounded-disposition path outcome

Actual elapsed time and cognitive effort are also not measured.

A narrow descriptive structural proxy is permitted from frozen response fields:

- review_step_count = number of submitted review_steps;
- reconfirmation_count = number of submitted reconfirmations;
- unknown_count = number of submitted unknowns;
- finding_count = number of submitted findings;
- process_check_count = number of submitted process_checks.

These counts describe the submitted review path. They are not equivalent to time, cost, cognitive effort, or operational latency.

Report them by condition only after the official pass is complete.

## Interpretation law

A condition producing fewer submitted steps is not automatically better.

A condition producing more submitted steps is not automatically more burdensome.

Path-complexity counts are descriptive aids for understanding how reviewers reached a bounded disposition and must be interpreted alongside correctness, false-positive review, unnecessary re-confirmation, and forbidden-inference outcomes.

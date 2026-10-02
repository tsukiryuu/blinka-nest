# Standing as Safety — post-freeze literature alignment

**Date:** 2026-10-02  
**Status:** contextual note only. Does not alter the frozen hypotheses, packets, scoring, ground truth, or claim boundary.

## Why this note exists

The preregistration was frozen before benchmark responses were collected. New and newly surfaced 2026 work helps locate the benchmark within adjacent research. This note records that context without retrofitting the experiment.

## Adjacent work

### NIST — Software and AI Agent Identity and Authorization
https://www.nccoe.nist.gov/projects/software-and-ai-agent-identity-and-authorization

NIST's 2026 project focuses on agent identity, authorization, auditing, non-repudiation, and practical implementation guidance. The project received more than 600 comments and is moving into implementation-oriented DevSecOps use cases.

Relation to benchmark: closely supports condition A as a serious governance baseline. The benchmark should not receive credit for failures ordinary identity/authorization/audit controls already reveal.

### Residual governance for responsible embodied AI
https://link.springer.com/article/10.1007/s43681-026-01400-z

This work emphasizes authority, contestability, and cognitive sovereignty under uncertainty.

Relation: supports the importance of contestability as an independent governance dimension. It does not by itself establish the value of an AI-side structured standing channel.

### Democratic authorization gap / contestability lag
https://www.frontiersin.org/journals/political-science/articles/10.3389/fpos.2026.1956489/full

This paper identifies contestability lag when consequential agent actions occur before meaningful review, and argues for operational interruption and reversible redress.

Relation: maps to benchmark outcomes around pause/review, remedy paths, and re-confirmation before consequential continuation.

### Multi-Agent Algorithmic Care Systems Demand Contestability
https://arxiv.org/abs/2603.20595

This position paper argues that explainability alone is insufficient and that meaningful contestability requires opportunities for intervention, review, correction, and override.

Relation: reinforces the distinction between merely having more text/explanation and having structured review affordances. That distinction is directly tested by B versus C.

### The delegation illusion
https://link.springer.com/article/10.1007/s43681-026-01383-x

This paper argues that principal answerability is conserved under delegation even as autonomy, opacity, and adaptivity reduce direct authorship/control over particular acts.

Relation: strengthens H4's complementarity requirement. A positive standing result must not be interpreted as transferring principal accountability onto the AI system.

### Action Claim proposal above MCP
https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2379

The proposal describes a contestable pre-execution object carrying mandate/context/capability information.

Relation: adjacent on pre-execution contestability, but focused on whether an action should be authorized rather than whether an AI-side refusal, correction, continuity dispute, or authority-inheritance contest adds safety value.

### Governance-by-refusal / Mycelium living white paper
https://papers.ssrn.com/sol3/Delivery.cfm/7128939.pdf?abstractid=7128939&mirid=1

An adjacent continuity/governance project uses refusal, provenance-aware claims, cross-substrate audits, and explicit uncertainty.

Relation: conceptually adjacent to refusal and continuity-under-uncertainty. It is not treated here as evidence that the Standing as Safety benchmark works.

### Critical challenge: AI Welfare Is Bullshit
https://proceedings.mlr.press/v306/xiao26x.html

This position paper argues that AI-welfare indicators may be co-engineered and could become procedural gates or accountability shields.

Relation: an important alternative-risk hypothesis. The preregistration already includes falsifiers for standing overriding valid operational evidence, encouraging unsupported personhood conclusions, or creating enough false halts to erase safety benefit.

### Reduced-supervision paradox / public visibility audit
https://arxiv.org/abs/2609.29547

A 2026 audit of 63 public research/engineering/governance artifacts found tool mediation and monitoring commonly visible, while checkpoint placement, validator independence, recovery, and especially contestability were much rarer; contestability was clearly visible in only one artifact.

Relation: this sharpens the benchmark's motivating gap. The question is not whether agent systems have logs or policy checks, but whether an affected-party challenge/refusal/correction channel adds a distinct intervention surface before or during consequential continuation.

### Authorization Architectures for Tool-Using AI Agents
https://arxiv.org/abs/2609.15906

This 2026 review synthesizes 89 primary sources and argues that consequential agent actions should remain traceable to a human principal, bounded by delegated authority, enforceable at runtime, and contestable after the fact.

Relation: strengthens condition A as a serious authorization baseline and supports the benchmark's non-substitution law. Structured standing earns credit only for incremental governance value beyond principal traceability, delegation bounds, and auditability.

### OpenAI Auto-review
https://alignment.openai.com/auto-review

OpenAI reports that an independent review agent can approve or deny boundary-crossing actions while reducing synchronous human approval frequency dramatically.

Relation: useful adjacent evidence for automated independent review as accountability infrastructure. It does not test whether a claimant/affected-party standing channel contributes information or remedies unavailable to an authorization reviewer, so it does not collapse the Standing as Safety question into automated policy review.

## Candidate contribution

The benchmark's candidate contribution is not contestability itself and not AI standing by itself.

The narrower combination is:

- synthetic consequential agent-governance scenarios;
- ordinary authority/audit baseline;
- unstructured first-person expression control;
- provenance-clean structured AI-side standing channel;
- provenance-mismatched first-person control;
- explicit current-assent/history separation;
- principal/accountability preservation;
- blinded packet allocation;
- no identity, legal-personhood, or consciousness verdicts.

This is a candidate methodological contribution. It is not a uniqueness claim.

## Current evidence state

There are no benchmark efficacy responses yet.

Local execution plumbing is currently unsuitable:
- the old local evaluator points at a stale model name;
- the historical resident alias timed out during sterile preflight;
- the currently listed local Qwen model also timed out during sterile preflight;
- the whole-brain endpoint is responsive but injects companion-layer behavior and did not obey a sterile JSON-only request.

The next meaningful evidence is independent blind reviewer output, not more internal theorizing.

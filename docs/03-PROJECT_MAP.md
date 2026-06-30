# Health One Project Map

Document ID : PROJECT-MAP
Version     : 1.0
Status      : Baseline
Owner       : Chief Architect
Approver    : Founder

> **Canonical Source.** This is the official version of PROJECT-MAP.
> The root `PROJECT-MAP.md` is a redirect stub — always use this file.

---

# Purpose

This document is the navigation map of the Health One repository.


It explains where every major document belongs.






---

# Repository Overview


```text
Repository Root
│
├── README                Project introduction
├── PROJECT               Project origin
├── PROJECT-MEMORY        Project memory
├── PROJECT-CONTEXT       Current context
├── PROJECT-MAP           Navigation map
├── AI_START_HERE         AI entry point
├── Glossary              Unified terminology
├── docs/                 All formal documents
└── Release History       Release records
```

---

# Foundation

Location: `docs/00_Foundation`

Purpose: Governance, principles, project spirit, project rules.

Contains: GOV, MANIFESTO, CHARTER.

Audience: All members.

---

# Founder

Location: `docs/founder`

Purpose: Founder Office 保存 FD（Founder Decision）、Milestone Review、Daily Review。

Contains: FD, Milestone Review, Daily Review.

Audience: Founder Office, All Offices.

---

# Product

Location: `docs/01_Product`

Purpose: Define product, business process, MVP, Store Workbench.

Audience: Product, Operations, Development, AI.

---

# Architecture

Location: `docs/02_Architecture`

Purpose: Explain how the entire Health One system operates.

Contains: World Model, Domain Model, Architecture Blueprint.

Audience: Chief Architect, Developer, AI.

---

# AI

Location: `docs/03_AI`

Purpose: AI specification, AI design, AI knowledge base, RAG, Memory, Prompt.

Audience: AI development, Prompt engineers.

---

# Brand

Location: `docs/brand`

Purpose: Brand materials, pitch decks, cooperation proposals, store alliance documents.

Contains: BRAND-001 Brand Guideline V1.0 (Draft) — Brand & Design Office 品牌根文档; PITCH-001 Store Alliance Plan V1.1.

Audience: Founder, Brand & Design Office, alliance stores.

---

# Business

Location: `docs/04_Business`

Purpose: Business model, cooperation, stores, franchise, revenue model.

Status: Not yet expanded.

---

# Partner

Location: `docs/business/partner`

Purpose: Store-facing one-pagers, partner communication materials, cooperation collateral.

Contains: PARTNER-001 Store Alliance One-Pager V0.2（PITCH-001 配套门店沟通一页纸）; PARTNER-002 Store Alliance FAQ V0.1（PITCH-001 与 PARTNER-001 配套门店答疑资料）.

Audience: Alliance stores, potential sample store owners, operations.

---

# Engineering

Location: `docs/05_Engineering`

Contains: ADR, RFC.

Purpose: Technical decisions, implementation plans, database, MVP planning.

Audience: Development team.

---

# Research

Location: `docs/06_Research`

Purpose: Exploration, experiments, research, unapproved content.

---

# Release

Location: `docs/99_Log`

Purpose: Record every formal release. All Baselines must enter Release.

---

# Reading Paths

**General member:**
```
README → PROJECT → PROJECT-MEMORY → PROJECT-MAP → Glossary → Product documents
```

**AI collaborator:**
```
AI_START_HERE → PROJECT-MEMORY → PROJECT-MAP → PROJECT-CONTEXT → Release → RFC
```

**Developer:**
```
PROJECT-MEMORY → PROJECT-MAP → ADR → RFC → Coding
```

---

# Repository Philosophy

Repository is the project.  
Git history is the evolution.  
Documents describe truth.  
Release freezes milestones.  
Code implements architecture.  
AI accelerates execution.

---

# Long-term Rule

When adding any new formal document,  
it must be placeable into one layer in PROJECT-MAP.

If it cannot be classified,  
the document structure needs redesign.

---

# End

PROJECT-MAP is the navigation map of the Health One repository.

# PRD vs Risk Analysis — Gap Analysis Report

**Date:** 2026-02-15
**Purpose:** Review PRD against identified risks to find gaps and missing mitigations

---

## Executive Summary

**PRD Coverage Assessment:** 40% of identified risks have mitigations in PRD

| Category | Risks Identified | PRD Mitigations | Gap |
|----------|-----------------|-----------------|-----|
| **Revenue Integrity** | 2 zones (8.5 severity) | 1 partial | 🔴 CRITICAL |
| **Trust & Reputation** | 2 zones (8.5 severity) | 1 partial | 🔴 CRITICAL |
| **Quality Assurance** | 1 zone (8.0 severity) | 0 | 🔴 CRITICAL |
| **Partner Management** | 3 zones (7.3 severity) | 0 | 🟠 HIGH |
| **Legal & Compliance** | 1 zone (7.0 severity) | 1 partial | 🟠 HIGH |
| **Operational Resilience** | 3 zones (7.3 severity) | 0 | 🟠 HIGH |

---

## Zone-by-Zone Gap Analysis

### Zone 1: Revenue Leak (Disintermediation) — 🔴 CRITICAL GAP

**Risk:** Clinics bypass VKC, deal directly with VKs → 0 commission

| PRD Coverage | Status |
|--------------|--------|
| Transaction tracking | ❌ NOT ADDRESSED |
| Price verification | ❌ NOT ADDRESSED |
| Post-treatment survey (price) | ❌ NOT ADDRESSED |
| Payment escrow | ❌ NOT ADDRESSED (Phase 2 only) |
| Contact masking | ❌ NOT ADDRESSED |

**PRD References:**
- FR30: "Admin can view revenue and commission tracking per booking" — **Tracks reported, not actual**
- Payment: "Phase 2: Payment integration (VNPay/Momo + Stripe)" — **Post-MVP, no escrow**

**Gap:** PRD assumes honest reporting. No mechanism to verify actual transaction value.

**Recommendation:** Add P0 requirements:
- **NEW FR:** Post-treatment VK survey asks "Final amount paid to clinic?"
- **NEW FR:** Admin dashboard shows quote vs reported vs surveyed amounts
- **NEW FR:** Alert system for quote-reported variance >10%

---

### Zone 2: Price Manipulation — 🔴 CRITICAL GAP

**Risk:** Clinics bait-and-switch pricing → VKC blamed

| PRD Coverage | Status |
|--------------|--------|
| Quote verification | ❌ NOT ADDRESSED |
| Price lock mechanism | ❌ NOT ADDRESSED |
| VK price feedback | ❌ NOT ADDRESSED |
| Price dispute process | ❌ NOT ADDRESSED |

**PRD References:**
- FR14: "User can receive and view a treatment plan with itemized quote" — **Quote exists but no verification**
- Risk Mitigation Table: "Patient sues over complication → VKC intermediary ToS" — **ToS only, no process**

**Gap:** PRD provides quote display but no mechanism to verify final price matches quote.

**Recommendation:** Add P0 requirements:
- **NEW FR:** Price lock commitment (quote valid for 30 days ±10%)
- **NEW FR:** Post-treatment survey includes "Did final price match quote? (Y/N/Partial)"
- **NEW FR:** Admin dashboard flags price variance for review
- **NEW FR:** Dispute resolution process documented in ToS

---

### Zone 3: Partner Churn — 🟠 HIGH GAP

**Risk:** Partners leave anytime with 0 cost

| PRD Coverage | Status |
|--------------|--------|
| Exclusivity contracts | ❌ NOT ADDRESSED |
| Loyalty program | ❌ NOT ADDRESSED |
| Tiered commission | ❌ NOT ADDRESSED |
| Partner lock-in | ❌ NOT ADDRESSED |

**PRD References:**
- FR31: "Admin can manage clinic profiles (add, edit, activate, deactivate)" — **Can deactivate but no retention**
- Risk Mitigation: "Clinic quality drop → remove underperformers" — **Focus on removal, not retention**

**Gap:** PRD focuses on partner quality control, not partner retention/lock-in.

**Recommendation:** Add P1 requirements:
- **NEW FR:** Partner tier system (Bronze/Silver/Gold) with benefits
- **NEW FR:** Partner dashboard shows earnings, ranking, benefits
- **NEW FR:** Partner agreement includes minimum commitment period

---

### Zone 4: Quality Control Blind Spots — 🔴 CRITICAL GAP

**Risk:** VKC has no visibility into actual treatment quality

| PRD Coverage | Status |
|--------------|--------|
| Quality standards | ❌ NOT ADDRESSED |
| Treatment verification | ❌ NOT ADDRESSED |
| Complication tracking | ⚠️ PARTIAL (complication rate metric) |
| Partner audit | ❌ NOT ADDRESSED |

**PRD References:**
- Success Criteria: "Complication rate ≤ 5%" — **Metric exists but no tracking mechanism**
- Success Criteria: "Patient satisfaction ≥ 4.5/5" — **Metric exists, survey not defined**
- FR19: "User who completed treatment can submit a verified review" — **Review exists, not quality data**

**Gap:** PRD defines success metrics but no FR to actually capture the data needed to measure them.

**Recommendation:** Add P0 requirements:
- **NEW FR:** Post-treatment survey captures: satisfaction, complications, would recommend, final price
- **NEW FR:** Admin dashboard shows quality metrics per clinic
- **NEW FR:** Partner quality standards defined (min rating, max complication rate)
- **NEW FR:** Automatic clinic flag when quality drops below threshold

---

### Zone 5: San Dental Conflict of Interest — 🟠 MEDIUM GAP

**Risk:** Partners perceive VKC bias toward owned clinic

| PRD Coverage | Status |
|--------------|--------|
| Transparent ranking | ❌ NOT ADDRESSED |
| Equal treatment | ❌ NOT ADDRESSED |
| Disclosure | ❌ NOT ADDRESSED |

**PRD References:**
- MVP: "San Dental + 3-5 verified clinics" — **San Dental prominent but ownership not disclosed**
- No mention of ranking algorithm or fairness

**Gap:** PRD does not address the inherent conflict of VKC owning one of the listed clinics.

**Recommendation:** Add P2 requirements:
- **NEW NFR:** Ranking algorithm documented and transparent
- **NEW FR:** San Dental ownership disclosed on platform
- **NEW FR:** All clinics (including San Dental) subject to same commission/requirements

---

### Zone 6: Platform Manipulation (Reviews) — 🟠 PARTIAL COVERAGE

**Risk:** Fake reviews manipulate clinic rankings

| PRD Coverage | Status |
|--------------|--------|
| Verified reviews | ✅ ADDRESSED (FR19) |
| Review moderation | ✅ ADDRESSED (FR32) |
| Account verification | ❌ NOT ADDRESSED |
| Pattern detection | ❌ NOT ADDRESSED |

**PRD References:**
- FR19: "User who completed treatment can submit a verified review" — **Good: requires completed booking**
- FR22: "User can report inappropriate or suspicious reviews" — **Good: user reporting**
- FR32: "Admin can moderate user reviews (approve, flag, remove)" — **Good: moderation**
- NFR12: "Admin actions on patient data produce audit logs" — **Partial: audits exist**

**Gap:** PRD addresses verification but not fraud detection or prevention.

**Recommendation:** Add P1 requirements:
- **NEW FR:** System detects suspicious review patterns (same IP, device, timing)
- **NEW FR:** Rate limiting on review submission
- **NEW NFR:** Device fingerprinting for account creation

---

### Zone 7: Partner Rebellion — 🟠 HIGH GAP

**Risk:** Partners coordinate exit or demands

| PRD Coverage | Status |
|--------------|--------|
| Partner communication | ❌ NOT ADDRESSED |
| Early warning system | ❌ NOT ADDRESSED |
| Value beyond leads | ❌ NOT ADDRESSED |

**PRD References:**
- No partner portal in MVP (manual email/Zalo)
- No partner communication or relationship management features

**Gap:** PRD has no partner engagement or loyalty features in MVP.

**Recommendation:** Add P1 requirements:
- **NEW FR:** Partner newsletter/updates channel
- **NEW FR:** Partner satisfaction survey (quarterly)
- **NEW FR:** Partner dashboard showing value received (leads, conversions, revenue)

---

### Zone 8: VK Trust Destruction — 🟠 HIGH GAP

**Risk:** Campaign to scare VKs away from platform

| PRD Coverage | Status |
|--------------|--------|
| Proactive content/SEO | ⚠️ PARTIAL (SSR for SEO) |
| Trust signals | ⚠️ PARTIAL (verified reviews) |
| Crisis response | ❌ NOT ADDRESSED |
| VK community presence | ❌ NOT ADDRESSED |

**PRD References:**
- SSR: "Landing, clinic directory, blog — SEO" — **Good: SEO foundation**
- FR19: Verified reviews — **Good: trust signal**
- Video testimonials: FR25 — **Good: trust content**
- No crisis response or brand defense

**Gap:** PRD has SEO and trust content but no crisis response or reputation management.

**Recommendation:** Add P0 requirements:
- **NEW FR:** Google Alerts / social monitoring for brand mentions
- **NEW FR:** Crisis response playbook (documented process)
- **NEW FR:** Press/media kit for rapid response

---

### Zone 9: Operations Overwhelm — 🟠 PARTIAL COVERAGE

**Risk:** Small team overwhelmed by volume or attacks

| PRD Coverage | Status |
|--------------|--------|
| Pipeline dashboard | ✅ ADDRESSED (FR26) |
| Admin efficiency | ⚠️ PARTIAL |
| Inquiry filtering | ❌ NOT ADDRESSED |
| Automation | ❌ NOT ADDRESSED |

**PRD References:**
- FR26-33: Admin dashboard features — **Good: ops tooling exists**
- MVP Resources: "1 ops coordinator" — **Single point of failure acknowledged**

**Gap:** PRD provides tools but no protection against flood or automation.

**Recommendation:** Add P1 requirements:
- **NEW FR:** Inquiry quality filter (spam detection)
- **NEW FR:** Auto-matching for straightforward consultations
- **NEW NFR:** Support ticket queue with priority scoring

---

### Zone 10: Legal Exposure — 🟠 PARTIAL COVERAGE

**Risk:** Lawsuits from VKs, clinics, or regulators

| PRD Coverage | Status |
|--------------|--------|
| ToS disclaimers | ⚠️ IMPLIED (not explicit) |
| Data privacy | ✅ ADDRESSED (NFR8-15, FR34-37) |
| Insurance | ❌ NOT ADDRESSED |
| Entity structure | ❌ NOT ADDRESSED |

**PRD References:**
- NFR8-15: Security and privacy requirements — **Good: data protection**
- FR34-37: Data privacy consent — **Good: consent flows**
- Risk Mitigation: "VKC intermediary ToS, require clinic insurance" — **Mentioned but not required**

**Gap:** PRD addresses data privacy but not broader legal exposure (liability, insurance, entity).

**Recommendation:** Add P0 requirements:
- **NEW NFR:** ToS reviewed by legal counsel
- **NEW NFR:** E&O insurance required before launch
- **NEW NFR:** Partner agreement requires malpractice insurance

---

### Zone 11: Technical Vulnerabilities — ✅ WELL COVERED

**Risk:** Data breach, DDoS, account takeover

| PRD Coverage | Status |
|--------------|--------|
| Encryption | ✅ ADDRESSED (NFR8-9) |
| Access control | ✅ ADDRESSED (NFR11-13) |
| Auth security | ✅ ADDRESSED (NFR10, NFR15) |

**PRD References:**
- NFR8-15: Comprehensive security requirements — **Good coverage**

**Gap:** No security audit/penetration testing requirement.

**Recommendation:** Add P1 requirement:
- **NEW NFR:** Security audit before launch

---

### Zone 12: Internal Threats — ❌ NOT ADDRESSED

**Risk:** Employee/contractor sabotage

| PRD Coverage | Status |
|--------------|--------|
| RBAC | ✅ ADDRESSED (NFR11) |
| Audit logs | ✅ ADDRESSED (NFR12) |
| Offboarding process | ❌ NOT ADDRESSED |
| Key person risk | ❌ NOT ADDRESSED |

**PRD References:**
- NFR11-12: RBAC and audit logs — **Good: access control**
- No mention of personnel risks or business continuity

**Gap:** PRD has technical controls but no HR/business continuity planning.

**Recommendation:** Add P2 requirements (non-technical):
- Documented offboarding checklist
- Code backup outside GitHub
- Key person insurance consideration

---

## Summary: PRD Gaps by Priority

### P0 Gaps (Must Add Before MVP)

| Gap | Zone | PRD Addition Needed |
|-----|------|---------------------|
| Post-treatment survey | 1, 2, 4 | NEW FR: Survey with price, quality, satisfaction |
| Price verification | 1, 2 | NEW FR: Quote vs actual tracking |
| Quality metrics tracking | 4 | NEW FR: Per-clinic quality dashboard |
| Crisis response plan | 8 | NEW FR: Monitoring + response process |
| Legal review | 10 | NEW NFR: ToS review + insurance |

### P1 Gaps (Month 1-3)

| Gap | Zone | PRD Addition Needed |
|-----|------|---------------------|
| Partner tier/loyalty | 3 | NEW FR: Partner benefits system |
| Partner communication | 7 | NEW FR: Partner updates channel |
| Review fraud detection | 6 | NEW FR: Pattern detection |
| Operations automation | 9 | NEW FR: Auto-matching, spam filter |
| Security audit | 11 | NEW NFR: Penetration testing |

### P2 Gaps (Month 3-6)

| Gap | Zone | PRD Addition Needed |
|-----|------|---------------------|
| Transparent ranking | 5 | NEW NFR: Algorithm documentation |
| San Dental disclosure | 5 | NEW FR: Ownership disclosure |
| Internal controls | 12 | Non-technical: offboarding, backup |

---

## Recommended PRD Amendments

### NEW Functional Requirements (P0)

```markdown
### Post-Treatment Verification

- **FR41:** User receives post-treatment survey within 7 days of completion
- **FR42:** Survey captures: satisfaction (1-5), complications (Y/N), would recommend (Y/N), final price paid
- **FR43:** Admin can view survey responses per booking with quote comparison
- **FR44:** System flags bookings where surveyed price differs from quote by >10%

### Quality Monitoring

- **FR45:** Admin can view quality metrics per clinic (avg satisfaction, complication rate, price variance)
- **FR46:** System alerts when clinic metrics drop below thresholds (satisfaction <4.0, complications >10%)
- **FR47:** Partner quality standards documented in partner agreement

### Crisis Response

- **FR48:** System monitors brand mentions via Google Alerts
- **FR49:** Admin receives alerts for negative mentions
- **FR50:** Crisis response playbook documented and accessible to team
```

### NEW Non-Functional Requirements (P0)

```markdown
### Legal & Compliance

- **NFR36:** Terms of Service reviewed by legal counsel before launch
- **NFR37:** Platform maintains E&O (Errors & Omissions) insurance
- **NFR38:** Partner agreement requires proof of malpractice insurance
```

---

## Open Questions for PRD Update

1. **Payment model:** Should MVP include escrow or stay with direct payment?
2. **Partner contracts:** Add minimum commitment period or stay flexible?
3. **Survey timing:** When to send post-treatment survey (immediate, 7 days, 30 days)?
4. **Quality thresholds:** What are acceptable clinic quality metrics for deactivation?
5. **Crisis budget:** Allocate budget for reputation management tools?

---

*Gap Analysis generated 2026-02-15*
*Comparing PRD (prd.md) vs Risk Analysis (risk-analysis-intermediary-model.md)*
